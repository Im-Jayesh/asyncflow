import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailWorkerService } from './mail-worker.service';
import { QUEUE_NAMES } from 'src/constants';
import { sendEmailProccessor } from './processors/email.processors';
import { getRedisConnection } from 'src/constants/bullmq.config';
import { Worker } from 'bullmq';

@Module({
    imports: [PrismaModule],
  providers: [MailWorkerService,
    {
          provide: 'MAIL_WORKER', // This is the unique token
          useFactory: () => {
            return new Worker(QUEUE_NAMES.EMAILNOTIFICATIONS, sendEmailProccessor, {
                    connection: getRedisConnection(),
                    concurrency: 10
                });
          },
        }
  ],

  exports: ['MAIL_WORKER']
})
export class MailWorkerModule {}
