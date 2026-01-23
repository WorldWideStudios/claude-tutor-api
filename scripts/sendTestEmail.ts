import { config } from "dotenv";
import { Inbound } from "inboundemail";
config();

export const main = async () => {
  const inbound = new Inbound({
    apiKey: process.env.INBOUND_API_KEY,
  });
  // Simple email
  const { id } = await inbound.emails.send({
    from: process.env.FROM_EMAIL!,
    to: process.env.TEST_EMAIL!,
    subject: "Welcome to Claude Tutor!",
    text: "Thanks for signing up!",
    html: "<p>Thanks for signing up!",
  });

  console.log("Email sent:", id);
};

main()
  .catch((error) => {
    console.error("Error sending test email:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
