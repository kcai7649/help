import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateOrganizationCommand } from '../impl/update-organization.command';
import { OrganizationRepository } from 'src/domains/organization/repositories';
import { OrganizationUpdatedEvent } from 'src/domains/organization/events/impl';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Organization } from '../../entities';
import { castToPartialEntity } from 'src/common/utils/cast-to-partial.util';

@CommandHandler(UpdateOrganizationCommand)
export class UpdateOrganizationHandler implements ICommandHandler<UpdateOrganizationCommand> {
  constructor(
    private readonly repo: OrganizationRepository,
    private readonly eventBus: EventBus,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(command: UpdateOrganizationCommand): Promise<any> {
    this.logger.log(`Handling UpdateOrganizationCommand for ID: ${command.id}`, UpdateOrganizationHandler.name);
    try {
      const organization = await this.repo.update(command.id, castToPartialEntity<Organization>(command.payload));
      this.eventBus.publish(new OrganizationUpdatedEvent(organization));
      return organization;
    } catch (error) {
      this.logger.error('Error updating organization', error.stack, UpdateOrganizationHandler.name);
      throw new InternalServerErrorException('Failed to update organization');
    }
  }
}