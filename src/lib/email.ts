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

    const chatHistory: {
      role: "user" | "assistant";
      content: string;
    }[] = [];
    if (pastEmails.data && pastEmails.data.length > 0) {
      for (const email of pastEmails.data) {
        chatHistory.push({
          role: email.direction === "SEND" ? "assistant" : "user",
          content: email.text,
        });
      }
    }
    chatHistory.push({
      role: "user",
      content: emailRecord.data?.text || "",
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
