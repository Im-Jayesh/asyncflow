import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { QueueModule } from './queue/queue.module';
import {  ThrottlerModule } from '@nestjs/throttler';
import { NotificationGatewayTsGateway } from './notification.gateway.ts/notification.gateway.ts.gateway';

@Module({
  imports: [PrismaModule, UserModule, QueueModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // Time to live in milliseconds (60 seconds)
          limit: 3,   // Maximum number of requests within the TTL
        },
      ],
    })
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGatewayTsGateway],
})
export class AppModule {}
