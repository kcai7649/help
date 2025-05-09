import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteRoleCommand } from '../impl/delete-role.command';
import { RoleRepository } from 'src/domains/role/repositories';
import { RoleDeletedEvent } from 'src/domains/role/events/impl';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    private readonly repo: RoleRepository,
    private readonly eventBus: EventBus,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<any> {
    this.logger.log(`Handling DeleteRoleCommand for ID: ${command.id}`, DeleteRoleHandler.name);
    try {
      const role = await this.repo.delete(command.id);
      this.eventBus.publish(new RoleDeletedEvent(role));
      return role;
    } catch (error) {
      this.logger.error('Error deleting role', error.stack, DeleteRoleHandler.name);
      throw error;
    }
  }
}
