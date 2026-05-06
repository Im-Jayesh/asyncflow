import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Throttle } from '@nestjs/throttler';
import { SendBulkEmailDto } from './dto/send-bulk-email.dto';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sendEmail')
  async emailUser(@Body() body: SendEmailDto) {
    await this.userService.sendEmailNotification(
      body.email,
      body.message,
      body.sendAt,
    );

    return {
      status: 'success',
      message: "Email notification sent",
    };
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('sendBulkEmail')
  async sendBulkEmail(@Body() body: SendBulkEmailDto) {
    const count = await this.userService.sendBulkNotification(
      body.message,
      body.sendAt,
    );

    return {
      status: 'success',
      message: `Bulk notification queued for ${count} users.`,
    };
  }
}