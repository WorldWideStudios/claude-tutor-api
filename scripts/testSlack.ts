import { sendSlackMessage } from "../src/lib/slack";

export const testSlack = async () => {
  await sendSlackMessage("This is a test message from the Claude Tutor API");
};

testSlack().then(() => {
  process.exit(0);
});
