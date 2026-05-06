import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {

    constructor(private readonly prisma: PrismaService, private readonly notificationGateway: NotificationGateway) {}

    async createNotification(userId:number, type: string, message: string) {
        const res = await this.prisma.notification.create({ data: { userId, type, message } })
        await this.notificationGateway.sendPrivateNotification(userId, res);
        return res;
    }

    async getUserNotifications(userId:number) {
        return await this.prisma.notification.findMany({
            where: {
                userId : userId 
            },
            orderBy: {
                createdAt: 'desc',
            }
        })
    }

    async markAsRead(id: number) {
        return await this.prisma.notification.update({
            where: {
                id: id
            },
            data: {
                isRead : true
            }
        })
    }


}
