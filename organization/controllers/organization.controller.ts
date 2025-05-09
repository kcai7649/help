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
import { OrganizationService } from 'src/domains/organization/services';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  FilterOrganizationDto,
} from 'src/domains/organization/dtos';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { PreventOrphanDeleteGuard } from 'src/common/guard/prevent-orphan-delete.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Action, Resource } from 'src/common/enums';
import { AuthenticationGuard, AuthorizationGuard } from 'src/guards';

@ApiTags('Organization')
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly service: OrganizationService,
    private readonly logger: AppLoggerService
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.organizations, actions: [Action.create] }])
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  @ApiBody({ type: CreateOrganizationDto })
  async create(@Body() dto: CreateOrganizationDto) {
    this.logger.log('Creating an organization', OrganizationController.name);
    try {
      return await this.service.create(dto);
    } catch (err) {
      this.logger.error('Error creating organization', err.stack, OrganizationController.name);
      throw new InternalServerErrorException('Unable to create organization');
    }
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.organizations, actions: [Action.update] }])
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  @ApiBody({ type: UpdateOrganizationDto })
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    this.logger.log(`Updating organization with id ${id}`, OrganizationController.name);
    try {
      return await this.service.update(id, dto);
    } catch (err) {
      this.logger.error(`Error updating organization ${id}`, err.stack, OrganizationController.name);
      throw new InternalServerErrorException('Unable to update organization');
    }
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard, PreventOrphanDeleteGuard('Organization'))
  @Permissions([{ resource: Resource.organizations, actions: [Action.delete] }])
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  async delete(@Param('id') id: string) {
    this.logger.log(`Deleting organization with id ${id}`, OrganizationController.name);
    try {
      return await this.service.delete(id);
    } catch (err) {
      this.logger.error(`Error deleting organization ${id}`, err.stack, OrganizationController.name);
      throw new InternalServerErrorException('Unable to delete organization');
    }
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.organizations, actions: [Action.read] }])
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved successfully' })
  async findById(@Param('id') id: string) {
    try {
      return await this.service.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Organization ${id} not found`);
        throw error; // ✅ Let NestJS return 404
      }
  
      this.logger.error(`Error fetching organization ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch organization');
    }
  }

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.organizations, actions: [Action.read] }])
  @ApiOperation({ summary: 'Get all organizations with pagination/filter/sort' })
  @ApiResponse({ status: 200, description: 'Organizations list retrieved' })
  async findAll(@Query() query: FilterOrganizationDto) {
    this.logger.log('Fetching all organizations', OrganizationController.name);
    try {
      return await this.service.findAll(query);
    } catch (err) {
      this.logger.error('Error fetching organizations', err.stack, OrganizationController.name);
      throw new InternalServerErrorException('Unable to fetch organizations');
    }
  }
}