import Inbound from "inboundemail";
import { IncomingEmail } from "../types";
import { generateResponse } from "./llm";
import { notifyExistingUserEmail, notifyNewUser } from "./slack";
import { supabaseAdmin } from "./supabase";
import { randomBytes } from "crypto";

const FROM_EMAIL = process.env.FROM_EMAIL || "email@claudetutor.com";

export const handleNewEmail = async (incomingEmail: IncomingEmail) => {
  const result = await supabaseAdmin
    .from("emails")
    .insert({
      subject: incomingEmail.subject,
      text: incomingEmail.text,
      from: incomingEmail.from.addresses[0]!.address,
      to: FROM_EMAIL,
      inbound_id: incomingEmail.id,
      thread_id: incomingEmail.threadId,
      thread_position: incomingEmail.threadPosition,
      direction: "RECEIVE",
    })
    .select("id")
    .single();

  for (const addr of incomingEmail.from.addresses) {
    const existing = await supabaseAdmin
      .from("address_info")
      .select("*")
      .eq("email", addr.address)
      .single();

    if (!existing.data) {
      await supabaseAdmin.from("address_info").insert({
        email: addr.address,
        name: addr.name,
      });
    }
  }

  if (result.data) {
    await respondToEmail(result.data.id);
  }
};

export const respondToEmail = async (emailId: number) => {
  const emailRecord = await supabaseAdmin
    .from("emails")
    .select("*")
    .eq("id", emailId)
    .single();

  const pastEmails = await supabaseAdmin
    .from("emails")
    .select("*")
    .or(`from.eq.${emailRecord.data?.from},to.eq.${emailRecord.data?.from}`)
    .order("created_at", { ascending: true });

  console.log("got here with past emails:", pastEmails);

  // Get user name for Slack notification
  const addressInfo = await supabaseAdmin
    .from("address_info")
    .select("name")
    .eq("email", emailRecord.data?.from)
    .single();
  const userName = addressInfo.data?.name;
  const userEmail = emailRecord.data?.from!;

  if (pastEmails?.data?.length === 1) {
    // Notify Slack of new user
    await notifyNewUser(userName, userEmail, emailRecord.data?.text || "");

    // Generate secure random token (64-character hex string)
    const token = randomBytes(32).toString("hex");

    // Insert session into Supabase
    const { error } = await supabaseAdmin.from("sessions").insert({
      email: emailRecord.data?.from,
      token,
      confirmed: true,
    });

    if (error) {
      console.error("Supabase error:", error);
      return;
    }
    const welcomeMessage = `
Hi there,

Thank you for reaching out to Claude Tutor! I'm here to assist you with any questions or topics you'd like to discuss.

Lets get you setup and started on your journey.  The first thing you will need is to ensure you have a properly setup environment, checkout our memo at $URL.

After that, you will need this token ${token} to authenticate your session in the cli.

Use this command in a properly setup Claude Tutor CLI

npm run start -- --token ${token}

I am here to answer any questions you may have, feel free to reply to this email!

Best regards,
Claude Tutor
    `;

    await sendEmail(
      emailRecord.data!.from,
      "Welcome to Claude Tutor!",
      welcomeMessage,
    );
  } else {
    // Notify Slack of existing user email
    await notifyExistingUserEmail(
      userName,
      userEmail,
      emailRecord.data?.text || "",
    );

    const sessionData = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("email", emailRecord.data?.from)
      .single();
    let token: string | null = null;

    if (!sessionData.data || !sessionData.data.confirmed) {
      console.log(
        "Session not found or not confirmed for email:",
        emailRecord.data?.from,
      );

      const newToken = randomBytes(32).toString("hex");

      // Insert session into Supabase
      const { error } = await supabaseAdmin.from("sessions").insert({
        email: emailRecord.data?.from,
        token,
        confirmed: true,
      });

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      token = newToken;
    } else {
      token = sessionData.data.token;
    }

    // Fetch CLI interactions for this session (last 10)
    const cliInteractions = await supabaseAdmin
      .from("cli_interactions")
      .select("*")
      .eq("session_token", token)
      .order("created_at", { ascending: false })
      .limit(10);

    // Build unified history items with timestamps for chronological sorting
    type HistoryItem = {
      role: "user" | "assistant";
      content: string;
      created_at: string;
      source: "email" | "cli";
    };

    const historyItems: HistoryItem[] = [];

    // Add email history
    if (pastEmails.data && pastEmails.data.length > 0) {
      for (const email of pastEmails.data) {
        historyItems.push({
          role: email.direction === "SEND" ? "assistant" : "user",
          content: email.text,
          created_at: email.created_at,
          source: "email",
        });
      }
    }

    // Add CLI interactions history (reversed to ascending order since we fetched desc)
    if (cliInteractions.data && cliInteractions.data.length > 0) {
      for (const interaction of cliInteractions.data.reverse()) {
        const { interaction_type, question_text, answer_text, created_at } =
          interaction;

        if (
          interaction_type === "initial_question" ||
          interaction_type === "clarifying_question"
        ) {
          // Two entries: assistant asks, user answers
          if (question_text) {
            historyItems.push({
              role: "assistant",
              content: question_text,
              created_at,
              source: "cli",
            });
          }
          if (answer_text) {
            historyItems.push({
              role: "user",
              content: answer_text,
              created_at,
              source: "cli",
            });
          }
          // If both are null, add empty string entry
          if (!question_text && !answer_text) {
            historyItems.push({
              role: "user",
              content: "",
              created_at,
              source: "cli",
            });
          }
        } else if (interaction_type === "user_selection") {
          historyItems.push({
            role: "user",
            content: answer_text || "",
            created_at,
            source: "cli",
          });
        } else if (
          interaction_type === "llm_response" ||
          interaction_type === "profile_created"
        ) {
          historyItems.push({
            role: "assistant",
            content: answer_text || "",
            created_at,
            source: "cli",
          });
        } else {
          // Fallback for any other interaction types
          historyItems.push({
            role: answer_text ? "user" : "assistant",
            content: answer_text || question_text || "",
            created_at,
            source: "cli",
          });
        }
      }
    }

    // Sort all history items chronologically
    historyItems.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    // Build final chat history with source prefixes
    const chatHistory: {
      role: "user" | "assistant";
      content: string;
    }[] = historyItems.map(({ role, content, source }) => ({
      role,
      content: `[${source === "email" ? "Email" : "CLI"}] ${content}`,
    }));

    // Add current incoming email
    chatHistory.push({
      role: "user",
      content: `[Email] ${emailRecord.data?.text || ""}`,
    });

    const response = await generateResponse(chatHistory, {
      token: token!,
    });
    await sendEmail(
      emailRecord.data!.from,
      `Re: ${emailRecord.data?.subject}`,
      response,
    );
  }
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const inbound = new Inbound({
    apiKey: process.env.INBOUND_API_KEY,
  });

  const response = await inbound.emails.send({
    from: FROM_EMAIL,
    to: to,
    subject: subject,
    text: text,
    html: `${text}`, //.replaceAll("\n", "<br/>")}`,
  });

  console.log("got response:", response);

  const result = await supabaseAdmin.from("emails").insert({
    subject: subject,
    text: text,
    to: to,
    from: FROM_EMAIL,
    inbound_id: response.id,
    direction: "SEND",
  });

  console.log("got supabase result:", result);
};

export const sendFollowupEmail = async (userEmail: string) => {
  // Fetch past emails for this user
  const pastEmails = await supabaseAdmin
    .from("emails")
    .select("*")
    .or(`from.eq.${userEmail},to.eq.${userEmail}`)
    .order("created_at", { ascending: true });

  // Get the most recent session for this user
  const sessionData = await supabaseAdmin
    .from("sessions")
    .select("*")
    .eq("email", userEmail)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let token: string | null = null;
  if (sessionData.data) {
    token = sessionData.data.token;
  }

  // Fetch CLI interactions for this session
  let cliInteractions: { data: any[] | null } = { data: null };
  if (token) {
    cliInteractions = await supabaseAdmin
      .from("cli_interactions")
      .select("*")
      .eq("session_token", token)
      .order("created_at", { ascending: false })
      .limit(50);
  }

  // Build unified history items with timestamps for chronological sorting
  type HistoryItem = {
    role: "user" | "assistant";
    content: string;
    created_at: string;
    source: "email" | "cli";
  };

  const historyItems: HistoryItem[] = [];

  // Add email history
  if (pastEmails.data && pastEmails.data.length > 0) {
    for (const email of pastEmails.data) {
      historyItems.push({
        role: email.direction === "SEND" ? "assistant" : "user",
        content: email.text,
        created_at: email.created_at,
        source: "email",
      });
    }
  }

  // Add CLI interactions history (reversed to ascending order since we fetched desc)
  if (cliInteractions.data && cliInteractions.data.length > 0) {
    for (const interaction of cliInteractions.data.reverse()) {
      const { interaction_type, question_text, answer_text, created_at } =
        interaction;

      if (
        interaction_type === "initial_question" ||
        interaction_type === "clarifying_question"
      ) {
        if (question_text) {
          historyItems.push({
            role: "assistant",
            content: question_text,
            created_at,
            source: "cli",
          });
        }
        if (answer_text) {
          historyItems.push({
            role: "user",
            content: answer_text,
            created_at,
            source: "cli",
          });
        }
        if (!question_text && !answer_text) {
          historyItems.push({
            role: "user",
            content: "",
            created_at,
            source: "cli",
          });
        }
      } else if (interaction_type === "user_selection") {
        historyItems.push({
          role: "user",
          content: answer_text || "",
          created_at,
          source: "cli",
        });
      } else if (
        interaction_type === "llm_response" ||
        interaction_type === "profile_created"
      ) {
        historyItems.push({
          role: "assistant",
          content: answer_text || "",
          created_at,
          source: "cli",
        });
      } else {
        historyItems.push({
          role: answer_text ? "user" : "assistant",
          content: answer_text || question_text || "",
          created_at,
          source: "cli",
        });
      }
    }
  }

  // Sort all history items chronologically
  historyItems.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  // Build final chat history with source prefixes
  const chatHistory: {
    role: "user" | "assistant";
    content: string;
  }[] = historyItems.map(({ role, content, source }) => ({
    role,
    content: `[${source === "email" ? "Email" : "CLI"}] ${content}`,
  }));

  // Add the summary request prompt
  chatHistory.push({
    role: "user",
    content: `[System] Please analyze this user's learning journey and generate a follow-up summary email. Return your response as a JSON object with exactly two fields:
- "subject": A personalized email subject line summarizing their learning journey
- "body": An HTML-formatted email body that covers:
  1. How they started (their initial question/goal)
  2. What they learned and worked on during their session
  3. Suggested next steps to continue their learning

Keep the tone friendly and encouraging. The body should be well-formatted HTML suitable for an email.

Return ONLY the JSON object, no additional text.`,
  });

  const response = await generateResponse(chatHistory, {
    ...(token && { token }),
    isEmail: true,
  });

  // Parse the JSON response
  let subject = "Your Claude Tutor Learning Summary";
  let body = response;

  try {
    // Try to extract JSON from the response (handle markdown code blocks)
    let jsonStr = response;
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    const parsed = JSON.parse(jsonStr);
    if (parsed.subject && parsed.body) {
      subject = parsed.subject;
      body = parsed.body;
    }
  } catch (e) {
    console.log("Failed to parse JSON response, using raw response as body");
  }

  await sendEmail(userEmail, subject, body);
};
