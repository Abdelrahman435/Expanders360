import { IsInt, IsNumber } from 'class-validator';

export class CreateMatchDto {
  @IsInt()
  project_id: number;

  @IsInt()
  vendor_id: number;

  @IsNumber()
  score: number;

  @IsInt()
  services_overlap_count: number;
}
