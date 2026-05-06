import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { QueueModule } from './queue/queue.module';
import {  ThrottlerModule } from '@nestjs/throttler';
import { NotificationGateway } from './notification/notification.gateway';
import { MailWorkerService } from './mail-worker/mail-worker.service';
import { MailWorkerModule } from './mail-worker/mail-worker.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [PrismaModule, UserModule, QueueModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // Time to live in milliseconds (60 seconds)
          limit: 3,   // Maximum number of requests within the TTL
        },
      ],
    }),
    MailWorkerModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGateway, MailWorkerService],
})
export class AppModule {}
