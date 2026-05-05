import { Worker } from "bullmq";

export function createWorker(queueName, processFunction, connection) {
    return new Worker(queueName, processFunction, {
        connection: connection,
    });
}
