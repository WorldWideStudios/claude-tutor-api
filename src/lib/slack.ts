import { config } from "dotenv";
config();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = "#t-claudetutor-bot";

/**
 * Send a message to the configured Slack channel.
 * Fails silently with a console.error if something goes wrong.
 */
export const sendSlackMessage = async (text: string): Promise<void> => {
  if (!SLACK_BOT_TOKEN) {
    console.error("SLACK_BOT_TOKEN not configured, skipping Slack notification");
    return;
  }

  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Slack API error:", data.error);
    }
  } catch (error) {
    console.error("Failed to send Slack message:", error);
  }
};

/**
 * Notify Slack when a new user enters the system.
 */
export const notifyNewUser = async (
  name: string | null | undefined,
  email: string
): Promise<void> => {
  const displayName = name || "Unknown";
  await sendSlackMessage(`new user has entered the system via email ${displayName} <${email}>`);
};

/**
 * Notify Slack when an existing user sends a new email.
 */
export const notifyExistingUserEmail = async (
  name: string | null | undefined,
  email: string
): Promise<void> => {
  const displayName = name || "Unknown";
  await sendSlackMessage(`got new email from ${displayName} <${email}>`);
};
