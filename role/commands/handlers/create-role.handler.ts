import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { RoleRepository } from 'src/domains/role/repositories';
import { CreateRoleCommand } from '../impl/create-role.command';
import { RoleCreatedEvent } from 'src/domains/role/events/impl';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { castToPartialEntity } from 'src/common/utils/cast-to-partial.util';
import { Role } from '../../entities';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    private readonly repo: RoleRepository,
    private readonly eventBus: EventBus,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(command: CreateRoleCommand): Promise<any> {
    this.logger.log('Handling CreateRoleCommand', CreateRoleHandler.name);
    try {
      const role = await this.repo.create(castToPartialEntity<Role>(command.payload));
      this.logger.log(`Role created with ID: ${role._id}`, CreateRoleHandler.name);
      this.eventBus.publish(new RoleCreatedEvent(role));
      return role;
    } catch (error) {
      this.logger.error('Error creating role', error.stack, CreateRoleHandler.name);
      throw error;
    }
  }
}
