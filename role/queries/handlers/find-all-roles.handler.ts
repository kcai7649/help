import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllRolesQuery } from '../impl/find-all-roles.query';
import { RoleRepository } from 'src/domains/role/repositories';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { InternalServerErrorException } from '@nestjs/common';

@QueryHandler(FindAllRolesQuery)
export class FindAllRolesHandler implements IQueryHandler<FindAllRolesQuery> {
  constructor(
    private readonly repo: RoleRepository,
    private readonly logger: AppLoggerService
  ) {}

  async execute(query: FindAllRolesQuery): Promise<any> {
    this.logger.log('Handling FindAllRolesQuery', FindAllRolesHandler.name);

    const {
      name,
      scope,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = query.filter;

    const filters: any = {};
    if (name) filters.name = name;
    if (scope) filters.scope = scope;

    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

    try {
      const roles = await this.repo.findAll(filters, sort, page, limit);
      this.logger.log(`Found ${roles.length} roles`, FindAllRolesHandler.name);
      return roles;
    } catch (error) {
      this.logger.error('Error fetching roles', error.stack, FindAllRolesHandler.name);
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }
}
