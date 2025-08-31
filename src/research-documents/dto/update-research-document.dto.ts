import { PartialType } from '@nestjs/swagger';
import { CreateResearchDocumentDto } from './create-research-document.dto';

export class UpdateResearchDocumentDto extends PartialType(
  CreateResearchDocumentDto,
) {}
