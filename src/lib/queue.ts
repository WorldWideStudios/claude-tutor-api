import Queue from "bull";
import { config } from "dotenv";
config();

export const queue = new Queue("email", {
  redis: process.env.WORKER_REDIS_URL,
});
