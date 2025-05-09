import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';

import { Organization, OrganizationSchema } from 'src/domains/organization/entities/organization.entity';
import { OrganizationRepository } from 'src/domains/organization/repositories';
import { OrganizationService } from 'src/domains/organization/services';
import { OrganizationController } from 'src/domains/organization/controllers/organization.controller';

import {
  CreateOrganizationHandler,
  UpdateOrganizationHandler,
  DeleteOrganizationHandler,
} from './commands/handlers';

import {
  FindAllOrganizationsHandler,
  FindOrganizationByIdHandler,
} from './queries/handlers';

import {
  OrganizationCreatedHandler,
  OrganizationUpdatedHandler,
  OrganizationDeletedHandler,
} from './events/handlers';

import { OrganizationSocketService } from './socket/organization-socket.service';
import { OrganizationSaga } from './sagas/organization.saga';
import { RefValidatorConstraint } from 'src/common/validators/ref-validator.constraint';

@Module({
  imports: [
    CqrsModule,
    MongooseModule,
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
  ],
  controllers: [OrganizationController],
  providers: [
    // Repository & Service
    OrganizationRepository,
    OrganizationService,
    // Socket Service
    OrganizationSocketService,
    // Command Handlers
    CreateOrganizationHandler,
    UpdateOrganizationHandler,
    DeleteOrganizationHandler,
    // Query Handlers
    FindAllOrganizationsHandler,
    FindOrganizationByIdHandler,
    // Event Handlers
    OrganizationCreatedHandler,
    OrganizationUpdatedHandler,
    OrganizationDeletedHandler,
    OrganizationSaga,
    RefValidatorConstraint,
  ],
  exports: [RefValidatorConstraint],
})
export class OrganizationModule {}