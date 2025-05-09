import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOrganizationByIdQuery } from '../impl/find-organization-by-id.query';
import { OrganizationRepository } from 'src/domains/organization/repositories';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

@QueryHandler(FindOrganizationByIdQuery)
export class FindOrganizationByIdHandler implements IQueryHandler<FindOrganizationByIdQuery> {
  constructor(
    private readonly repo: OrganizationRepository,
    private readonly logger: AppLoggerService
  ) {}

  async execute(query: FindOrganizationByIdQuery): Promise<any> {
    this.logger.log(`Fetching organization by ID: ${query.id}`, FindOrganizationByIdHandler.name);

    try {
      const organization = await this.repo.findById(query.id);
      if (!organization) {
        this.logger.warn(`Organization not found for ID: ${query.id}`, FindOrganizationByIdHandler.name);
        throw new NotFoundException(`Organization with ID ${query.id} not found`);
      }
      return organization;
    } catch (error) {
      this.logger.error('Error fetching organization by ID', error.stack, FindOrganizationByIdHandler.name);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to fetch organization');
    }
  }
}