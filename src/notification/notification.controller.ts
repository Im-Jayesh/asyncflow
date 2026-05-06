import { Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

    constructor(private readonly notificationService: NotificationService) {}

    @Post(':id')
    postNotification(@Param('id', ParseIntPipe)) {}
    
    @Get(':id')
    getNotificationsByUserId(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.getUserNotifications(id);
    }

    @Patch(':id')
    setIsReadTrue(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.markAsRead(id);
    }

}
