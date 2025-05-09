import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RoleDeletedEvent } from '../impl/role-deleted.event';
import { RoleSocketService } from 'src/domains/role/socket/role-socket.service';
import { AppLoggerService } from 'src/common/logger/logger.service';

@EventsHandler(RoleDeletedEvent)
export class RoleDeletedHandler implements IEventHandler<RoleDeletedEvent> {
  constructor(
    private readonly roleSocketService: RoleSocketService,
    private readonly logger: AppLoggerService,
  ) {}

  async handle(event: RoleDeletedEvent) {
    const ctx = RoleDeletedHandler.name;
    try {
      this.logger.log(`Role deleted with ID: ${event.role._id}`, ctx);
      this.roleSocketService.emitDeleted(event.role);
    } catch (error) {
      this.logger.error(`Failed to emit role.deleted for ID: ${event.role._id}`, error.stack, ctx);
    }
  }
}
