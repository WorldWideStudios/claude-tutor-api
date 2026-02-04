import { config } from "dotenv";
import { WebClient } from "@slack/web-api";
config();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = "#t-claudetutor-bot";

/**
 * Send a message to the configured Slack channel.
 * Fails silently with a console.error if something goes wrong.
 */
export const sendSlackMessage = async (text: string): Promise<void> => {
  if (!SLACK_BOT_TOKEN) {
    console.error(
      "SLACK_BOT_TOKEN not configured, skipping Slack notification",
    );
    return;
  }

  const slackClient = new WebClient(SLACK_BOT_TOKEN);

  try {
    await slackClient.chat.postMessage({
      channel: SLACK_CHANNEL,
      text: text,
    });
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }
};

/**
 * Notify Slack when a new user enters the system.
 */
export const notifyNewUser = async (
  name: string | null | undefined,
  email: string,
  emailContent: string,
): Promise<void> => {
  const displayName = name || "Unknown";
  await sendSlackMessage(
    `new user has entered the system via email ${displayName} <${email}>\n\`\`\`\n${emailContent}\n\`\`\``,
  );
};

/**
 * Notify Slack when an existing user sends a new email.
 */
export const notifyExistingUserEmail = async (
  name: string | null | undefined,
  email: string,
  emailContent: string,
): Promise<void> => {
  const displayName = name || "Unknown";
  await sendSlackMessage(
    `got new email from ${displayName} <${email}>\n\`\`\`\n${emailContent}\n\`\`\``,
  );
};

/**
 * Notify Slack when a user starts a new CLI session.
 */
export const notifyCliInit = async (
  name: string | null | undefined,
  email: string,
): Promise<void> => {
  const displayName = name || "Unknown";
  await sendSlackMessage(
    `${displayName} <${email}> has started a new cli session`,
  );
};

/**
 * Notify Slack when a user resumes a CLI session.
 */
export const notifyCliResume = async (
  name: string | null | undefined,
  email: string,
): Promise<void> => {
  const displayName = name || "Unknown";
  await sendSlackMessage(
    `${displayName} <${email}> has resumed their cli session`,
  );
};

/**
 * Notify Slack when a user completes their CLI session.
 */
export const notifyCliCompleted = async (
  name: string | null | undefined,
  email: string,
): Promise<void> => {
  const displayName = name || "Unknown";
  await sendSlackMessage(
    `${displayName} <${email}> has completed their cli session`,
  );
};
