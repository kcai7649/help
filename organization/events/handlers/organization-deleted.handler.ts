import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrganizationDeletedEvent } from '../impl/organization-deleted.event';
import { OrganizationSocketService } from 'src/domains/organization/socket/organization-socket.service';
import { AppLoggerService } from 'src/common/logger/logger.service';

@EventsHandler(OrganizationDeletedEvent)
export class OrganizationDeletedHandler implements IEventHandler<OrganizationDeletedEvent> {
  constructor(
    private readonly organizationSocketService: OrganizationSocketService,
    private readonly logger: AppLoggerService,
  ) {}

  async handle(event: OrganizationDeletedEvent) {
    const ctx = OrganizationDeletedHandler.name;
    try {
      this.logger.log(`Organization deleted with ID: ${event.organization._id}`, ctx);
      this.organizationSocketService.emitDeleted(event.organization);
    } catch (error) {
      this.logger.error(`Failed to emit organization.deleted for ID: ${event.organization._id}`, error.stack, ctx);
    }
  }
}