import { UpdateOrganizationDto } from 'src/domains/organization/dtos';

export class UpdateOrganizationCommand {
  constructor(public readonly id: string, public readonly payload: UpdateOrganizationDto) {}
}