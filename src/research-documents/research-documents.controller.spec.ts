import { Test, TestingModule } from '@nestjs/testing';
import { ResearchDocumentsController } from './research-documents.controller';

describe('ResearchDocumentsController', () => {
  let controller: ResearchDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResearchDocumentsController],
    }).compile();

    controller = module.get<ResearchDocumentsController>(
      ResearchDocumentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
