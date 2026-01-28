import express, { Request, Response } from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import { queue } from "./lib/queue";
import { inboundEmailHander } from "./lib/handlers";
import { supabaseAdmin } from "./lib/supabase";
import { sendEmail } from "./lib/email";
import { generateResponse } from "./lib/llm";
import { notifyCliInit } from "./lib/slack";
import { SessionInitRequest, SessionInitResponse } from "./types";

interface LogInteractionRequest {
  session_token: string;
  interaction_type: string;
  question_text?: string;
  answer_text?: string;
  question_index?: number;
  question_header?: string;
  options?: any;
  metadata?: any;
}

const app = express();
const PORT = process.env.PORT || 3000;

//app.set("trust proxy", 1);
// // CORS configuration
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//   ? process.env.ALLOWED_ORIGINS.split(",")
//   : ["http://localhost:3000", "http://localhost:8080"];

app.use(express.json());

app.use(
  cors({
    origin: true, //process.env.NODE_ENV === "production" ? allowedOrigins : true, // Allow all origins in development
    credentials: true,
  }),
);

app.get("/", (_req: Request, res: Response): void => {
  res.send("ok");
});

app.post(
  "/email/inbound",
  async (req: Request, res: Response): Promise<void> => {
    console.log("new email received");
    await inboundEmailHander(req.body);
    res.status(200).json({});
  },
);

app.post(
  "/user-session/init",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email }: SessionInitRequest = req.body;

      // Validate email presence
      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
      }

      // Generate secure random token (64-character hex string)
      const token = randomBytes(32).toString("hex");

      // Insert session into Supabase
      const { error } = await supabaseAdmin.from("sessions").insert({
        email,
        token,
        confirmed: false,
      });

      if (error) {
        console.error("Supabase error:", error);
        res.status(500).json({ error: "Failed to create session" });
        return;
      }

      // Save email to address_info table
      const existing = await supabaseAdmin
        .from("address_info")
        .select("*")
        .eq("email", email)
        .single();

      if (!existing.data) {
        await supabaseAdmin.from("address_info").insert({
          email: email,
          name: null,
        });
      }

      // Send confirmation email with link
      const hostname = process.env.HOSTNAME || "http://localhost:3000";
      const confirmLink = `${hostname}/user-session/confirm/${token}`;
      const emailText = `Please confirm your session by clicking the following link:\n\n${confirmLink}`;
      const emailSubject = "Confirm your session";

      await sendEmail(email, emailSubject, emailText);

      // Return the token
      const response: SessionInitResponse = { token };
      res.status(200).json(response);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

app.get(
  "/user-session/confirm/:token",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;

      if (!token) {
        res.status(400).json({ error: "Token is required" });
        return;
      }

      // Find the session by token
      const { data: session, error: fetchError } = await supabaseAdmin
        .from("sessions")
        .select("*")
        .eq("token", token)
        .single();

      if (fetchError || !session) {
        res.status(404).json({ error: "Invalid or expired token" });
        return;
      }

      // Check if already confirmed
      if (session.confirmed) {
        res.status(200).json({ message: "Session already confirmed" });
        return;
      }

      // Update the session to confirmed
      const { error: updateError } = await supabaseAdmin
        .from("sessions")
        .update({ confirmed: true })
        .eq("token", token);

      if (updateError) {
        console.error("Error updating session:", updateError);
        res.status(500).json({ error: "Failed to confirm session" });
        return;
      }

      res.status(200).json({ message: "Session confirmed successfully" });
    } catch (error) {
      console.error("Error confirming session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

app.post("/cli/init", async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    // Validate token presence
    if (!token) {
      res.status(400).json({ error: "Token is required" });
      return;
    }

    // Validate token exists and is confirmed
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("token", token)
      .eq("confirmed", true)
      .single();

    if (sessionError || !session) {
      res.status(401).json({ error: "Invalid or unconfirmed token" });
      return;
    }

    // Fetch user name for Slack notification
    const { data: addressInfo } = await supabaseAdmin
      .from("address_info")
      .select("name")
      .eq("email", session.email)
      .single();
    const userName = addressInfo?.name;

    // Notify Slack (fire-and-forget, don't block response)
    notifyCliInit(userName, session.email);

    // Query all emails for this user
    const { data: emails, error: emailsError } = await supabaseAdmin
      .from("emails")
      .select("*")
      .or(`from.eq.${session.email},to.eq.${session.email}`)
      .order("created_at", { ascending: true });

    if (emailsError) {
      console.error("Error fetching emails:", emailsError);
      res.status(500).json({ error: "Failed to fetch email history" });
      return;
    }

    const totalMessages = emails?.length || 0;
    let question: string;

    // If more than 2 emails, generate contextual question with LLM
    if (totalMessages > 2) {
      // Build chat history for LLM context
      const chatHistory: { role: "user" | "assistant"; content: string }[] = [];

      for (const email of emails!) {
        chatHistory.push({
          role: email.direction === "SEND" ? "assistant" : "user",
          content: email.text,
        });
      }

      // Add prompt to generate initialization question
      chatHistory.push({
        role: "user",
        content:
          "Based on our previous conversation, generate a natural follow-up question asking what I want to build next. Keep it concise and conversational.",
      });

      // Generate contextual question using LLM
      question = await generateResponse(chatHistory, {
        isEmail: false,
      });
    } else {
      // Default initialization question
      question = "What do you want to build?";
    }

    // Return response
    res.status(200).json({
      success: true,
      email: session.email,
      totalMessages,
      question,
    });
  } catch (error) {
    console.error("Error in /cli/init:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/cli/log-interaction",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        session_token,
        interaction_type,
        question_text,
        answer_text,
        question_index,
        question_header,
        options,
        metadata,
      }: LogInteractionRequest = req.body;

      // Validate required fields
      if (!session_token) {
        res.status(400).json({ error: "session_token is required" });
        return;
      }

      if (!interaction_type) {
        res.status(400).json({ error: "interaction_type is required" });
        return;
      }

      // Validate interaction_type is one of the allowed values
      const allowedTypes = [
        "initial_question",
        "clarifying_question",
        "user_selection",
        "profile_created",
        "llm_response",
      ];
      if (!allowedTypes.includes(interaction_type)) {
        res.status(400).json({
          error: `interaction_type must be one of: ${allowedTypes.join(", ")}`,
        });
        return;
      }

      // Validate question_index if provided
      if (
        question_index !== undefined &&
        (!Number.isInteger(question_index) || question_index < 0)
      ) {
        res.status(400).json({
          error: "question_index must be a non-negative integer",
        });
        return;
      }

      // Validate options if provided
      if (
        options !== undefined &&
        (typeof options !== "object" ||
          options === null ||
          Array.isArray(options))
      ) {
        res.status(400).json({
          error: "options must be a valid JSON object",
        });
        return;
      }

      // Validate metadata if provided
      if (
        metadata !== undefined &&
        (typeof metadata !== "object" ||
          metadata === null ||
          Array.isArray(metadata))
      ) {
        res.status(400).json({
          error: "metadata must be a valid JSON object",
        });
        return;
      }

      // Validate token exists and is confirmed
      const { data: session, error: sessionError } = await supabaseAdmin
        .from("sessions")
        .select("*")
        .eq("token", session_token)
        .eq("confirmed", true)
        .single();

      if (sessionError || !session) {
        res.status(401).json({ error: "Invalid or unconfirmed token" });
        return;
      }

      // Build the interaction object
      const interaction: any = {
        session_token,
        interaction_type,
      };

      // Add optional fields if provided
      if (question_text !== undefined)
        interaction.question_text = question_text;
      if (answer_text !== undefined) interaction.answer_text = answer_text;
      if (question_index !== undefined)
        interaction.question_index = question_index;
      if (question_header !== undefined)
        interaction.question_header = question_header;
      if (options !== undefined) interaction.options = options;
      if (metadata !== undefined) interaction.metadata = metadata;

      // Insert into cli_interactions table
      const { error: insertError } = await supabaseAdmin
        .from("cli_interactions")
        .insert(interaction);

      if (insertError) {
        console.error("Error logging interaction:", insertError);
        res.status(500).json({ error: "Failed to log interaction" });
        return;
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error in /cli/log-interaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

app.listen(PORT, (): void => {
  console.log(`listening on ${PORT}`);
});
