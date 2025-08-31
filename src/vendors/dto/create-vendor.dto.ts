import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  countries_supported: string[];

  @IsArray()
  @IsString({ each: true })
  services_offered: string[];

  @IsNumber()
  rating: number;

  @IsNumber()
  response_sla_hours: number;

  @IsOptional()
  sla_expiry_date?: Date;
}
