import { Test, TestingModule } from '@nestjs/testing';
import { ResearchDocumentsService } from './research-documents.service';

describe('ResearchDocumentsService', () => {
  let service: ResearchDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResearchDocumentsService],
    }).compile();

    service = module.get<ResearchDocumentsService>(ResearchDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
