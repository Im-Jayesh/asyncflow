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

async sendBulkNotification(message: string, sendAt?: string) {
    const sendAtDate = sendAt ? new Date(sendAt) : null;
    let delay = 0;

    if (sendAtDate) {
      delay = Math.max(0, sendAtDate.getTime() - new Date().getTime());
    }

    // 1. Fetch all users (Assuming you have a User model. Adjust as needed!)
    const allUsers = await this.prisma.user.findMany({
      select: { email: true }
    });

    if (allUsers.length === 0) return 0;

    // 2. Create Job records in DB efficiently using Prisma transactions
    const jobCreationPromises = allUsers.map(user => 
      this.prisma.job.create({
        data: {
          email: user.email,
          message: message,
          sendAt: sendAtDate,
        }
      })
    );
    
    const createdJobs = await this.prisma.$transaction(jobCreationPromises);

    // 3. Map to the format our QueueService expects
    const jobsForQueue = createdJobs.map(job => ({
      jobId: job.id,
      delay: delay
    }));

    // 4. Send the whole batch to BullMQ
    await this.queueService.addBulkEmailJobs(jobsForQueue);

    return createdJobs.length;
  }
}