import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import IORedis from 'ioredis';
import { QueueEvents } from 'bullmq';
import { QUEUE_NAMES } from 'src/constants';

@WebSocketGateway({ cors: true})
export class NotificationGateway implements OnGatewayInit {
  
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

    // Initialize QueueEvents for EMAILNOTIFICATIONS
    this.queueEvents = new QueueEvents(QUEUE_NAMES.EMAILNOTIFICATIONS, {
      connection: this.connection
    });

        // Listen to events
    this.queueEvents.on('completed', ({ jobId, returnvalue }) => {
      this.server.emit('email_sent', {jobId, returnvalue})
    });

    this.queueEvents.on('failed', ({ jobId, failedReason }) => {
      this.server.emit('email_sent_failed', {jobId, failedReason})
    });

  }


  
}
