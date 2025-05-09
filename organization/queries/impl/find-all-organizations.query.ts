import { FilterOrganizationDto } from 'src/domains/organization/dtos';

export class FindAllOrganizationsQuery {
  constructor(public readonly filter: FilterOrganizationDto) {}
}