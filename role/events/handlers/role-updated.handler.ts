import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RoleUpdatedEvent } from '../impl/role-updated.event';
import { RoleSocketService } from 'src/domains/role/socket/role-socket.service';
import { AppLoggerService } from 'src/common/logger/logger.service';

@EventsHandler(RoleUpdatedEvent)
export class RoleUpdatedHandler implements IEventHandler<RoleUpdatedEvent> {
  constructor(
    private readonly roleSocketService: RoleSocketService,
    private readonly logger: AppLoggerService,
  ) {}

  async handle(event: RoleUpdatedEvent) {
    const ctx = RoleUpdatedHandler.name;
    try {
      this.logger.log(`Role updated with ID: ${event.role._id}`, ctx);
      this.roleSocketService.emitUpdated(event.role);
    } catch (error) {
      this.logger.error(`Failed to emit role.updated for ID: ${event.role._id}`, error.stack, ctx);
    }
  }
}
