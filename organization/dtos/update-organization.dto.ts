import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, enum: ['prime', 'subcontractor', 'client', 'system'] })
  @IsOptional()
  @IsEnum(['prime', 'subcontractor', 'client', 'system'])
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;
}