import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from 'src/domains/organization/entities/organization.entity';
import { AppLoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectModel(Organization.name) private readonly model: Model<Organization>,
    private readonly logger: AppLoggerService,
  ) {}

  async create(data: Partial<Organization>): Promise<Organization> {
    try {
      this.logger.log('Creating Organization', OrganizationRepository.name);
      return await this.model.create(data);
    } catch (err) {
      this.logger.error('Error creating Organization', err.stack, OrganizationRepository.name);
      throw new InternalServerErrorException('Failed to create organization');
    }
  }

  async update(id: string, data: Partial<Organization>): Promise<Organization> {
    try {
      this.logger.log(`Updating Organization ${id}`, OrganizationRepository.name);
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
      this.logger.error(`Error updating Organization ${id}`, err.stack, OrganizationRepository.name);
      throw new InternalServerErrorException('Failed to update organization');
    }
  }

  async delete(id: string): Promise<Organization> {
    try {
      this.logger.log(`Deleting Organization ${id}`, OrganizationRepository.name);
      return await this.model.findByIdAndDelete(id);
    } catch (err) {
      this.logger.error(`Error deleting Organization ${id}`, err.stack, OrganizationRepository.name);
      throw new InternalServerErrorException('Failed to delete organization');
    }
  }

  async findById(id: string): Promise<Organization> {
    try {
      this.logger.log(`Finding Organization by id: ${id}`, OrganizationRepository.name);
      return await this.model.findById(id);
    } catch (err) {
      this.logger.error(`Error finding Organization by id ${id}`, err.stack, OrganizationRepository.name);
      throw new InternalServerErrorException('Failed to fetch organization');
    }
  }

  async findAll(filters: any, sort: any, page: number, limit: number): Promise<Organization[]> {
    try {
      this.logger.log(`Finding all organizations with filters: ${JSON.stringify(filters)}`, OrganizationRepository.name);
      return await this.model
        .find(filters)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (err) {
      this.logger.error('Error finding all organizations', err.stack, OrganizationRepository.name);
      throw new InternalServerErrorException('Failed to fetch organizations');
    }
  }
}