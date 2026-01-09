import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server!: Server;

    handleConnection() {
    }

    notifyEmployeeCreated(payload: { employeeId: string; name: string }) {
        this.server.emit('employee.created', payload);
    }

    notifyImportProgress(payload: { jobId: string; progress: number }) {
        this.server.emit('employee.import.progress', payload);
    }

    notifyImportDone(payload: { jobId: string; total: number }) {
        this.server.emit('employee.import.done', payload);
    }
}
