import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/domains/role/entities/role.entity';
import { AppLoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name) private readonly model: Model<Role>,
    private readonly logger: AppLoggerService,
  ) {}

  async create(data: Partial<Role>): Promise<Role> {
    try {
      this.logger.log('Creating Role', RoleRepository.name);
      return await this.model.create(data);
    } catch (err) {
      this.logger.error('Error creating Role', err.stack, RoleRepository.name);
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    try {
      this.logger.log(`Updating Role ${id}`, RoleRepository.name);
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
      this.logger.error(`Error updating Role ${id}`, err.stack, RoleRepository.name);
      throw new InternalServerErrorException('Failed to update role');
    }
  }

  async delete(id: string): Promise<Role> {
    try {
      this.logger.log(`Deleting Role ${id}`, RoleRepository.name);
      return await this.model.findByIdAndDelete(id);
    } catch (err) {
      this.logger.error(`Error deleting Role ${id}`, err.stack, RoleRepository.name);
      throw new InternalServerErrorException('Failed to delete role');
    }
  }

  async findById(id: string): Promise<Role> {
    try {
      this.logger.log(`Finding Role by id: ${id}`, RoleRepository.name);
      return await this.model.findById(id);
    } catch (err) {
      this.logger.error(`Error finding Role by id ${id}`, err.stack, RoleRepository.name);
      throw new InternalServerErrorException('Failed to fetch role');
    }
  }

  async findAll(filters: any, sort: any, page: number, limit: number): Promise<Role[]> {
    try {
      this.logger.log(`Finding all roles with filters: ${JSON.stringify(filters)}`, RoleRepository.name);
      return await this.model
        .find(filters)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (err) {
      this.logger.error('Error finding all roles', err.stack, RoleRepository.name);
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }
}
