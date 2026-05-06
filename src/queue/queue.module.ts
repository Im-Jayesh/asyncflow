import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from 'src/constants/index';
import { getRedisConnection } from 'src/constants/bullmq.config';

@Module({
  providers: [QueueService,
    {
      provide: 'MAIL_QUEUE', // This is the unique token
      useFactory: () => {
        return new Queue(QUEUE_NAMES.EMAILNOTIFICATIONS, {
          connection: getRedisConnection(),
        });
      },
    },
  ],
  exports: [QueueService, 'MAIL_QUEUE']
})
export class QueueModule {}
