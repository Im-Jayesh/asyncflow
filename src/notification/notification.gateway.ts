import { OnGatewayConnection, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import IORedis from 'ioredis';
import { QueueEvents } from 'bullmq';
import { QUEUE_NAMES } from 'src/constants';
import { Socket } from 'socket.io'; // Make sure to import Socket!

@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection {
  
  @WebSocketServer() server;
  connection: IORedis | null;
  queueEvents: QueueEvents | null;

  constructor() {
    this.connection = null;
    this.queueEvents = null;
  }

  afterInit(server: any) {
    this.connection = new IORedis({
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null, 
    });

    this.queueEvents = new QueueEvents(QUEUE_NAMES.EMAILNOTIFICATIONS, {
      connection: this.connection
    });

    this.queueEvents.on('completed', ({ jobId, returnvalue }) => {
      this.server.emit('email_sent', {jobId, returnvalue})
    });

    this.queueEvents.on('failed', ({ jobId, failedReason }) => {
      this.server.emit('email_sent_failed', {jobId, failedReason})
    });
  }


  handleConnection(client: Socket) {
    // 1. Extract the Database User ID from the frontend connection request
    const userId = client.handshake.query.userId;

    if (userId) {
      // 2. Create the room name
      const roomName = `room_user_${userId}`;
      
      // 3. Actually join the room!
      client.join(roomName);
      console.log(`🔌 User ${userId} joined WebSocket room: ${roomName}`);
    } else {
      console.log('⚠️ A client connected without a userId');
    }
  }

  
  sendPrivateNotification(userId: number, payload: any) {
    // server.to(roomName) ensures ONLY people in that room get the message
    this.server.to(`room_user_${userId}`).emit('new_notification', payload);
  }
}