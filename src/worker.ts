import Inbound from "inboundemail";
import { queue } from "./lib/queue";
import { config } from "dotenv";
import { handleNewEmail } from "./lib/email";
config();

queue.process(async (job: any) => {
  const { data: incoming } = job;
  const { type, data } = incoming;
  console.log("running job");
  await handleNewEmail(data);
});

console.log("Worker is running and waiting for jobs...");
