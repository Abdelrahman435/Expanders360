import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateResearchDocumentDto {
  @IsInt()
  projectId: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    pageCount?: number;
    wordCount?: number;
    version?: string;
    category?: string;
  };
}
