import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrganizationsQuery } from '../impl/find-all-organizations.query';
import { OrganizationRepository } from 'src/domains/organization/repositories';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { InternalServerErrorException } from '@nestjs/common';

@QueryHandler(FindAllOrganizationsQuery)
export class FindAllOrganizationsHandler implements IQueryHandler<FindAllOrganizationsQuery> {
  constructor(
    private readonly repo: OrganizationRepository,
    private readonly logger: AppLoggerService
  ) {}

  async execute(query: FindAllOrganizationsQuery): Promise<any> {
    this.logger.log('Handling FindAllOrganizationsQuery', FindAllOrganizationsHandler.name);

    const {
      name,
      type,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = query.filter;

    const filters: any = {};
    if (name) filters.name = name;
    if (type) filters.type = type;

    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

    try {
      const organizations = await this.repo.findAll(filters, sort, page, limit);
      this.logger.log(`Found ${organizations.length} organizations`, FindAllOrganizationsHandler.name);
      return organizations;
    } catch (error) {
      this.logger.error('Error fetching organizations', error.stack, FindAllOrganizationsHandler.name);
      throw new InternalServerErrorException('Failed to fetch organizations');
    }
  }
}