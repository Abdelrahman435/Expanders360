import {
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  country: string;

  @IsArray()
  @IsString({ each: true })
  services_needed: string[];

  @IsNumber()
  budget: number;

  @IsOptional()
  @IsBoolean()
  is_expansion_project?: boolean;

  @IsOptional()
  @IsNumber()
  client_id?: number;
}
