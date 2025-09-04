import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ResearchDocument,
  ResearchDocumentDocument,
} from './schemas/research-document.schema';

@Injectable()
export class ResearchDocumentsService {
  constructor(
    @InjectModel(ResearchDocument.name)
    private readonly researchModel: Model<ResearchDocumentDocument>,
  ) {}

  async createDocument(dto: any) {
    const doc = new this.researchModel(dto);
    return doc.save();
  }

  async findByProject(projectId: number) {
    return this.researchModel.find({ projectId }).exec();
  }
}
