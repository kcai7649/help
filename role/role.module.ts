import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';

import { Role, RoleSchema } from 'src/domains/role/entities/role.entity';
import { RoleRepository } from 'src/domains/role/repositories';
import { RoleService } from 'src/domains/role/services';
import { RoleController } from 'src/domains/role/controllers/role.controller';

import {
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
} from './commands/handlers';

import {
  FindAllRolesHandler,
  FindRoleByIdHandler,
} from './queries/handlers';

import {
  RoleCreatedHandler,
  RoleUpdatedHandler,
  RoleDeletedHandler,
} from './events/handlers';

import { RoleSocketService } from './socket/role-socket.service';
import { RoleSaga } from './sagas/role.saga';
import { OrganizationModule } from '../organization/organization.module';
import { RefValidatorConstraint } from 'src/common/validators/ref-validator.constraint';

@Module({
  imports: [
    CqrsModule,
    OrganizationModule,
    MongooseModule,
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],
  providers: [
    // Repository & Service
    RoleRepository,
    RoleService,
    // Socket Service
    RoleSocketService,
    // Command Handlers
    CreateRoleHandler,
    UpdateRoleHandler,
    DeleteRoleHandler,
    // Query Handlers
    FindAllRolesHandler,
    FindRoleByIdHandler,
    // Event Handlers
    RoleCreatedHandler,
    RoleUpdatedHandler,
    RoleDeletedHandler,
    RoleSaga,
    RefValidatorConstraint

  ],
  exports:[RefValidatorConstraint]
})
export class RoleModule{}
