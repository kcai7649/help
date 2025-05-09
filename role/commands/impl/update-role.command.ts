import { UpdateRoleDto } from 'src/domains/role/dtos';

export class UpdateRoleCommand {
  constructor(public readonly id: string, public readonly payload: UpdateRoleDto) {}
}
