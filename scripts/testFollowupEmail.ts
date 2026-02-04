import { config } from "dotenv";
config();

import { sendFollowupEmail } from "../src/lib/email";

export const main = async () => {
  const testEmail = process.env.TEST_EMAIL;

  if (!testEmail) {
    throw new Error("TEST_EMAIL environment variable is required");
  }

  console.log(`Sending follow-up email to: ${testEmail}`);
  await sendFollowupEmail(testEmail);
  console.log("Follow-up email sent successfully!");
};

main()
  .catch((error) => {
    console.error("Error sending follow-up email:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
