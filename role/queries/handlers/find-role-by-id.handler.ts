import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRoleByIdQuery } from '../impl/find-role-by-id.query';
import { RoleRepository } from 'src/domains/role/repositories';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

@QueryHandler(FindRoleByIdQuery)
export class FindRoleByIdHandler implements IQueryHandler<FindRoleByIdQuery> {
  constructor(
    private readonly repo: RoleRepository,
    private readonly logger: AppLoggerService
  ) {}

  async execute(query: FindRoleByIdQuery): Promise<any> {
    this.logger.log(`Fetching role by ID: ${query.id}`, FindRoleByIdHandler.name);

    try {
      const role = await this.repo.findById(query.id);
      if (!role) {
        this.logger.warn(`Role not found for ID: ${query.id}`, FindRoleByIdHandler.name);
        throw new NotFoundException(`Role with ID ${query.id} not found`);
      }
      return role;
    } catch (error) {
      this.logger.error('Error fetching role by ID', error.stack, FindRoleByIdHandler.name);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to fetch role');
    }
  }
}
