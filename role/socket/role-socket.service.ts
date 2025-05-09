import { Injectable } from '@nestjs/common';
import { SocketGateway } from 'src/socket/socket.gateway';
import { AppLoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class RoleSocketService {
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly logger: AppLoggerService,
  ) {}

  private get server() {
    return this.socketGateway.server;
  }

  emitCreated(role: any) {
    this.logger.log(`Emitting role.created for ID: ${role?._id}`, RoleSocketService.name);
    this.server?.emit('role.created', role);
  }

  emitUpdated(role: any) {
    this.logger.log(`Emitting role.updated for ID: ${role?._id}`, RoleSocketService.name);
    this.server?.emit('role.updated', role);
  }

  emitDeleted(role: any) {
    this.logger.log(`Emitting role.deleted for ID: ${role?._id}`, RoleSocketService.name);
    this.server?.emit('role.deleted', role);
  }
}
