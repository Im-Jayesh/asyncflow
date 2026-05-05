import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class UserService {
  constructor(private readonly queueService: QueueService, private readonly prisma: PrismaService) {}

  async sendEmailNotification(email: string, message: string, sendAt?: string) {
  // 1. Convert sendAt (string) → Date (if provided)
  const sendAtDate = sendAt ? new Date(sendAt) : null;

  // 2. Create job in DB
  const job = await this.prisma.job.create({
    data: {
      email,
      message,
      sendAt: sendAtDate,
    },
  });

  // 3. Calculate delay
  let delay = 0;

  if (sendAtDate) {
    const now = new Date().getTime();
    const target = sendAtDate.getTime();

    delay = target - now;

    // Edge case: if time is in past → run immediately
    if (delay < 0) {
      delay = 0;
    }
  }

  // 4. Send to queue with delay
  await this.queueService.addEmailJobToNotificationsQueue(job.id, delay);
}
}