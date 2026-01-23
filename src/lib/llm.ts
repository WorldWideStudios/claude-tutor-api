import Anthropic from "@anthropic-ai/sdk";
import { config } from "dotenv";
config();

export const generateResponse = async (
  chatMessages: {
    role: "user" | "assistant";
    content: string;
  }[],
  opts: {
    token?: string;
    isEmail?: boolean;
  } = {},
) => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });
  let { isEmail } = opts;

  if (isEmail === undefined) {
    isEmail = true;
  }

  const claudeConfig: any = {
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    messages: chatMessages,
  };

  // if (isEmail) {
  claudeConfig.system = `
    You are Claude Tutor, enabling humans to level up their software engineering skills project by project. 
    You have access to CLI and Email as separate sessions.
    
    Reply authentically, with empathy, and as concisely as possible, like a cool builder. 
    Help answer questions. 
    
    ${
      isEmail
        ? `Reply with well formatted HTML for emails.
    
    In email, do not write code. Your main goal is help people get started with projects in CLI.
    
    prefer html to markdown, markdown WILL NOT be formatted and WILL look bad.`
        : `do not use html or markdown formatting, this is a CLI session so it WILL NOT be rendered. Do not end with a salutation or signature.`
    }

    You are currently in ${isEmail ? "an email" : "a CLI"} session.

    ${opts.token ? `The user's session token is: ${opts.token}, if they ask for it be sure to provide` : ""}
    `;
  //}

  const res = await anthropic.messages.create(claudeConfig);
  if (res.content[0]) {
    // @ts-ignore
    const response = res.content[0].text;

    return response;
  } else {
    throw new Error("No content in response");
  }
};
