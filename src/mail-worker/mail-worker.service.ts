import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { Worker } from 'bullmq';

@Injectable()
export class MailWorkerService implements OnModuleInit, OnModuleDestroy {

  constructor(private readonly prisma: PrismaService, @Inject('MAIL_WORKER') private readonly worker: Worker ) {}

  onModuleInit() {

    // ✅ Set up listeners ONCE during initialization
    this.worker.on('completed', (job) => {
      console.log(`✅ Job completed: ${job.id}`);
    });

    this.worker.on('failed', async (job, err) => {
      console.log(`❌ Job failed: ${job?.id}`, err);
      if (job) {
        await this.prisma.job.update({
          where: { id: job.data.jobId },
          data: { status: 'failed' },
        });
      }
    });
  }

  async onModuleDestroy() {
    // 🛑 Gracefully shut down the worker when the app stops
    await this.worker?.close();
  }
}