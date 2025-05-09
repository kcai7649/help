import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateRoleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: ['system', 'organization'], required: false })
  @IsEnum(['system', 'organization'])
  @IsOptional()
  scope?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsMongoId()
  @RefValidator('Organization') 
  organization_id?: string;
}
