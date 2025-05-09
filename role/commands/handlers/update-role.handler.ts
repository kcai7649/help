import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateRoleCommand } from '../impl/update-role.command';
import { RoleRepository } from 'src/domains/role/repositories';
import { RoleUpdatedEvent } from 'src/domains/role/events/impl';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Role } from '../../entities';
import { castToPartialEntity } from 'src/common/utils/cast-to-partial.util';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    private readonly repo: RoleRepository,
    private readonly eventBus: EventBus,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<any> {
    this.logger.log(`Handling UpdateRoleCommand for ID: ${command.id}`, UpdateRoleHandler.name);
    try {
      const role = await this.repo.update(command.id, castToPartialEntity<Role>(command.payload));
      this.eventBus.publish(new RoleUpdatedEvent(role));
      return role;
    } catch (error) {
      this.logger.error('Error updating role', error.stack, UpdateRoleHandler.name);
      throw new InternalServerErrorException('Failed to update role');
    }
  }
}
