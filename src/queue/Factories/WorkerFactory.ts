import { Worker } from "bullmq";

interface WorkerOptions {
    concurrency?: number; // Optional concurrency setting
}

export function createWorker(queueName, processFunction, connection, workerOptions: WorkerOptions = {}) {
    return new Worker(queueName, processFunction, {
        connection: connection,
        ...workerOptions
    });
}
