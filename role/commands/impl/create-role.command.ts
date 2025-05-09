import { CreateRoleDto } from 'src/domains/role/dtos';

export class CreateRoleCommand {
  constructor(public readonly payload: CreateRoleDto) {}
}
