import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RoleCreatedEvent } from '../impl/role-created.event';
import { RoleSocketService } from 'src/domains/role/socket/role-socket.service';
import { AppLoggerService } from 'src/common/logger/logger.service';

@EventsHandler(RoleCreatedEvent)
export class RoleCreatedHandler implements IEventHandler<RoleCreatedEvent> {
  constructor(
    private readonly roleSocketService: RoleSocketService,
    private readonly logger: AppLoggerService,
  ) {}

  async handle(event: RoleCreatedEvent) {
    const ctx = RoleCreatedHandler.name;
    try {
      this.logger.log(`Role created with ID: ${event.role._id}`, ctx);
      this.roleSocketService.emitCreated(event.role);
    } catch (error) {
      this.logger.error(`Failed to emit role.created for ID: ${event.role._id}`, error.stack, ctx);
    }
  }
}
