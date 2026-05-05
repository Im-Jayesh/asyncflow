import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE_NAMES, JOB_NAMES } from 'src/constants/constants';
import { createQueue } from './Factories/QueueFactory';

@Injectable()
export class QueueService {
  private connection: IORedis;
  private email_notificationQueue: Queue;

  constructor() {
    this.connection = new IORedis({
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null, // keep consistent
    });

    this.email_notificationQueue = createQueue(QUEUE_NAMES.EMAILNOTIFICATIONS, this.connection);
  }
  
  async addEmailJobToNotificationsQueue(jobId: number, delay: number) {
    console.log("📤 Adding job to queue...");

    await this.email_notificationQueue.add(JOB_NAMES.SEND_EMAIL, {
      jobId
    },{
        delay: delay,
        attempts: 3, // retry up to 3 times if it fails
        backoff: {
            type: 'exponential',
            delay: 5000, // wait 5 seconds before retrying
        },
    });
  }
}