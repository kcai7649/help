import { FilterRoleDto } from 'src/domains/role/dtos';

export class FindAllRolesQuery {
  constructor(public readonly filter: FilterRoleDto) {}
}
