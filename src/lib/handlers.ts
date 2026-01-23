import { queue } from "./queue";

export const inboundEmailHander = async (postBody: any) => {
  const { event, email, timestamp } = postBody;
  const { id, from, subject, cleanedContent, threadId, threadPosition } = email;
  const { text } = cleanedContent;

  if (event === "email.received") {
    const response = await queue.add({
      type: "inbound_email",
      data: { id, from, subject, text, timestamp, threadId, threadPosition },
    });

    console.log("res:", response);
  }
};
