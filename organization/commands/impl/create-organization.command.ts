import { CreateOrganizationDto } from 'src/domains/organization/dtos';

export class CreateOrganizationCommand {
  constructor(public readonly payload: CreateOrganizationDto) {}
}