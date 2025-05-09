import { Injectable } from '@nestjs/common';
import { SocketGateway } from 'src/socket/socket.gateway';
import { AppLoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class OrganizationSocketService {
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly logger: AppLoggerService,
  ) {}

  private get server() {
    return this.socketGateway.server;
  }

  emitCreated(organization: any) {
    this.logger.log(`Emitting organization.created for ID: ${organization?._id}`, OrganizationSocketService.name);
    this.server?.emit('organization.created', organization);
  }

  emitUpdated(organization: any) {
    this.logger.log(`Emitting organization.updated for ID: ${organization?._id}`, OrganizationSocketService.name);
    this.server?.emit('organization.updated', organization);
  }

  emitDeleted(organization: any) {
    this.logger.log(`Emitting organization.deleted for ID: ${organization?._id}`, OrganizationSocketService.name);
    this.server?.emit('organization.deleted', organization);
  }
}