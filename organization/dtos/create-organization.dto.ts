import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['prime', 'subcontractor', 'client', 'system'] })
  @IsEnum(['prime', 'subcontractor', 'client', 'system'])
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;
}