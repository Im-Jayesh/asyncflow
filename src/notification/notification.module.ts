import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [PrismaModule],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController]
})
export class NotificationModule {}
