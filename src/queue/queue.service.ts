import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { JOB_NAMES } from 'src/constants';

@Injectable()
export class QueueService {

  constructor(
    @Inject('MAIL_QUEUE') private readonly emailQueue: Queue
  ) {}
  
  async addEmailJobToNotificationsQueue(jobId: number, delay: number) {
    console.log("📤 Adding job to queue...");

    await this.emailQueue.add(JOB_NAMES.SEND_EMAIL, {
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

  
  async addBulkEmailJobs(jobs: { jobId: number; delay: number }[]) {
    console.log(`📤 Adding ${jobs.length} bulk jobs to queue...`);

    const bulkJobs = jobs.map((job) => ({
      name: JOB_NAMES.SEND_EMAIL,
      data: { jobId: job.jobId },
      opts: {
        delay: job.delay,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    }));

    await this.emailQueue.addBulk(bulkJobs);
  }

}