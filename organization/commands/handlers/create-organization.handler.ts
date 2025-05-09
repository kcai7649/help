import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { OrganizationRepository } from 'src/domains/organization/repositories';
import { CreateOrganizationCommand } from '../impl/create-organization.command';
import { OrganizationCreatedEvent } from 'src/domains/organization/events/impl';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { castToPartialEntity } from 'src/common/utils/cast-to-partial.util';
import { Organization } from '../../entities';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler implements ICommandHandler<CreateOrganizationCommand> {
  constructor(
    private readonly repo: OrganizationRepository,
    private readonly eventBus: EventBus,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<any> {
    this.logger.log('Handling CreateOrganizationCommand', CreateOrganizationHandler.name);
    try {
      const organization = await this.repo.create(castToPartialEntity<Organization>(command.payload));
      this.logger.log(`Organization created with ID: ${organization._id}`, CreateOrganizationHandler.name);
      this.eventBus.publish(new OrganizationCreatedEvent(organization));
      return organization;
    } catch (error) {
      this.logger.error('Error creating organization', error.stack, CreateOrganizationHandler.name);
      throw error;
    }
  }
}