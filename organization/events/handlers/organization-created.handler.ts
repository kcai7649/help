import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrganizationCreatedEvent } from '../impl/organization-created.event';
import { OrganizationSocketService } from 'src/domains/organization/socket/organization-socket.service';
import { AppLoggerService } from 'src/common/logger/logger.service';

@EventsHandler(OrganizationCreatedEvent)
export class OrganizationCreatedHandler implements IEventHandler<OrganizationCreatedEvent> {
  constructor(
    private readonly organizationSocketService: OrganizationSocketService,
    private readonly logger: AppLoggerService,
  ) {}

  async handle(event: OrganizationCreatedEvent) {
    const ctx = OrganizationCreatedHandler.name;
    try {
      this.logger.log(`Organization created with ID: ${event.organization._id}`, ctx);
      this.organizationSocketService.emitCreated(event.organization);
    } catch (error) {
      this.logger.error(`Failed to emit organization.created for ID: ${event.organization._id}`, error.stack, ctx);
    }
  }
}