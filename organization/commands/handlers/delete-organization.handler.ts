import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteOrganizationCommand } from '../impl/delete-organization.command';
import { OrganizationRepository } from 'src/domains/organization/repositories';
import { OrganizationDeletedEvent } from 'src/domains/organization/events/impl';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(DeleteOrganizationCommand)
export class DeleteOrganizationHandler implements ICommandHandler<DeleteOrganizationCommand> {
  constructor(
    private readonly repo: OrganizationRepository,
    private readonly eventBus: EventBus,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(command: DeleteOrganizationCommand): Promise<any> {
    this.logger.log(`Handling DeleteOrganizationCommand for ID: ${command.id}`, DeleteOrganizationHandler.name);
    try {
      const organization = await this.repo.delete(command.id);
      this.eventBus.publish(new OrganizationDeletedEvent(organization));
      return organization;
    } catch (error) {
      this.logger.error('Error deleting organization', error.stack, DeleteOrganizationHandler.name);
      throw error;
    }
  }
}