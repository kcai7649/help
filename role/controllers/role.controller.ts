import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  Query,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RoleService } from 'src/domains/role/services';
import {
  CreateRoleDto,
  UpdateRoleDto,
  FilterRoleDto,
} from 'src/domains/role/dtos';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { PreventOrphanDeleteGuard } from 'src/common/guard/prevent-orphan-delete.guard';

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly service: RoleService,
    private readonly logger: AppLoggerService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiBody({ type: CreateRoleDto })
  async create(@Body() dto: CreateRoleDto) {
    console.log('DTO constructor:', dto.constructor.name);
    this.logger.log('Creating a role', RoleController.name);
    try {
      return await this.service.create(dto);
    } catch (err) {
      this.logger.error('Error creating role', err.stack, RoleController.name);
      throw new InternalServerErrorException('Unable to create role');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiBody({ type: UpdateRoleDto })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    this.logger.log(`Updating role with id ${id}`, RoleController.name);
    try {
      return await this.service.update(id, dto);
    } catch (err) {
      this.logger.error(`Error updating role ${id}`, err.stack, RoleController.name);
      throw new InternalServerErrorException('Unable to update role');
    }
  }

  @Delete(':id')
  @UseGuards(PreventOrphanDeleteGuard('Role'))
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  async delete(@Param('id') id: string) {
    this.logger.log(`Deleting role with id ${id}`, RoleController.name);
    try {
      return await this.service.delete(id);
    } catch (err) {
      this.logger.error(`Error deleting role ${id}`, err.stack, RoleController.name);
      throw new InternalServerErrorException('Unable to delete role');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  async findById(@Param('id') id: string) {
    try {
      return await this.service.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Role ${id} not found`);
        throw error; // ✅ Let NestJS return 404
      }
  
      this.logger.error(`Error fetching role ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch role');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles with pagination/filter/sort' })
  @ApiResponse({ status: 200, description: 'Roles list retrieved' })
  async findAll(@Query() query: FilterRoleDto) {
    this.logger.log('Fetching all roles', RoleController.name);
    try {
      return await this.service.findAll(query);
    } catch (err) {
      this.logger.error('Error fetching roles', err.stack, RoleController.name);
      throw new InternalServerErrorException('Unable to fetch roles');
    }
  }
}
