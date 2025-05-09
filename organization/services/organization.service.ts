import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrganizationDto, UpdateOrganizationDto, FilterOrganizationDto } from 'src/domains/organization/dtos';
import {
  CreateOrganizationCommand,
  UpdateOrganizationCommand,
  DeleteOrganizationCommand,
} from 'src/domains/organization/commands/impl';
import {
  FindAllOrganizationsQuery,
  FindOrganizationByIdQuery,
} from 'src/domains/organization/queries/impl';
import { AppLoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: AppLoggerService,
  ) {}

  async create(payload: CreateOrganizationDto) {
    this.logger.log('Dispatching CreateOrganizationCommand', OrganizationService.name);
    try {
      return await this.commandBus.execute(new CreateOrganizationCommand(payload));
    } catch (err) {
      this.logger.error('Error executing CreateOrganizationCommand', err.stack, OrganizationService.name);
      throw new InternalServerErrorException('Failed to create organization');
    }
  }

  async update(id: string, payload: UpdateOrganizationDto) {
    this.logger.log('Dispatching UpdateOrganizationCommand', OrganizationService.name);
    try {
      return await this.commandBus.execute(new UpdateOrganizationCommand(id, payload));
    } catch (err) {
      this.logger.error('Error executing UpdateOrganizationCommand', err.stack, OrganizationService.name);
      throw new InternalServerErrorException('Failed to update organization');
    }
  }

  async delete(id: string) {
    this.logger.log('Dispatching DeleteOrganizationCommand', OrganizationService.name);
    try {
      return await this.commandBus.execute(new DeleteOrganizationCommand(id));
    } catch (err) {
      this.logger.error('Error executing DeleteOrganizationCommand', err.stack, OrganizationService.name);
      throw new InternalServerErrorException('Failed to delete organization');
    }
  }

  async findById(id: string){
    try {
      return await this.queryBus.execute(new FindOrganizationByIdQuery(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Organization not found for ID: ${id}`);
        throw error;
      }
  
      this.logger.error('Unexpected error executing FindOrganizationByIdQuery', error.stack);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async findAll(filter: FilterOrganizationDto) {
    this.logger.log('Dispatching FindAllOrganizationsQuery', OrganizationService.name);
      return await this.queryBus.execute(new FindAllOrganizationsQuery(filter));
   
  }
}