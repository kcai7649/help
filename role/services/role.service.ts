import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRoleDto, UpdateRoleDto, FilterRoleDto } from 'src/domains/role/dtos';
import {
  CreateRoleCommand,
  UpdateRoleCommand,
  DeleteRoleCommand,
} from 'src/domains/role/commands/impl';
import {
  FindAllRolesQuery,
  FindRoleByIdQuery,
} from 'src/domains/role/queries/impl';
import { AppLoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: AppLoggerService,
  ) {}

  async create(payload: CreateRoleDto) {
    this.logger.log('Dispatching CreateRoleCommand', RoleService.name);
    try {
      return await this.commandBus.execute(new CreateRoleCommand(payload));
    } catch (err) {
      this.logger.error('Error executing CreateRoleCommand', err.stack, RoleService.name);
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  async update(id: string, payload: UpdateRoleDto) {
    this.logger.log('Dispatching UpdateRoleCommand', RoleService.name);
    try {
      return await this.commandBus.execute(new UpdateRoleCommand(id, payload));
    } catch (err) {
      this.logger.error('Error executing UpdateRoleCommand', err.stack, RoleService.name);
      throw new InternalServerErrorException('Failed to update role');
    }
  }

  async delete(id: string) {
    this.logger.log('Dispatching DeleteRoleCommand', RoleService.name);
    try {
      return await this.commandBus.execute(new DeleteRoleCommand(id));
    } catch (err) {
      this.logger.error('Error executing DeleteRoleCommand', err.stack, RoleService.name);
      throw new InternalServerErrorException('Failed to delete role');
    }
  }

  async findById(id: string){
    try {
      return await this.queryBus.execute(new FindRoleByIdQuery(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Role not found for ID: ${id}`);
        throw error;
      }
  
      this.logger.error('Unexpected error executing FindRoleByIdQuery', error.stack);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async findAll(filter: FilterRoleDto) {
    this.logger.log('Dispatching FindAllRolesQuery', RoleService.name);
      return await this.queryBus.execute(new FindAllRolesQuery(filter));
   
  }
}
