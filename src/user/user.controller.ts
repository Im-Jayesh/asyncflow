import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sendEmail')
  async emailUser(@Body() body: { email: string; message: string; sendAt?: string }) {
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
}