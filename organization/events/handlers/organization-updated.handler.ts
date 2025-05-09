import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrganizationUpdatedEvent } from '../impl/organization-updated.event';
import { OrganizationSocketService } from 'src/domains/organization/socket/organization-socket.service';
import { AppLoggerService } from 'src/common/logger/logger.service';

@EventsHandler(OrganizationUpdatedEvent)
export class OrganizationUpdatedHandler implements IEventHandler<OrganizationUpdatedEvent> {
  constructor(
    private readonly organizationSocketService: OrganizationSocketService,
    private readonly logger: AppLoggerService,
  ) {}

  async handle(event: OrganizationUpdatedEvent) {
    const ctx = OrganizationUpdatedHandler.name;
    try {
      this.logger.log(`Organization updated with ID: ${event.organization._id}`, ctx);
      this.organizationSocketService.emitUpdated(event.organization);
    } catch (error) {
      this.logger.error(`Failed to emit organization.updated for ID: ${event.organization._id}`, error.stack, ctx);
    }
  }
}