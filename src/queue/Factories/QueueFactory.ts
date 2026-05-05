import { Queue } from "bullmq";

export function createQueue(queueName, connection) {
  return new Queue(queueName, {
      connection: connection,
      
    });
}