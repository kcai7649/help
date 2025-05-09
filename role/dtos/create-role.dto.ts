import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RefValidator } from 'src/common/decorators/ref-validator.decorator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['system', 'organization'] })
  @IsEnum(['system', 'organization'])
  scope: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => value) 
  @RefValidator('Organization') 
  organization_id?: string;
}
