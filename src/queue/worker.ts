import IORedis from "ioredis";
import { PrismaClient } from '@prisma/client';
import { createWorker } from "./Factories/WorkerFactory";
import { sendEmailProccessor } from "./proccesors/email.proccessors";
import { QUEUE_NAMES } from "../constants/constants";

console.log("🚀 Worker started");

const prisma = new PrismaClient();

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = createWorker(
  QUEUE_NAMES.EMAILNOTIFICATIONS,
  sendEmailProccessor,
  connection
);


// Optional but VERY useful for debugging
worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", async (job, err) => {
  console.log(`❌ Job failed: ${job?.id}`, err);
  await prisma.job.update({
    where: {
      id: job ? job.data.jobId : undefined,
    },
    data: {
      status: "failed",
    },
  });
});