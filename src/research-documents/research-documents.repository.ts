import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ResearchDocument,
  ResearchDocumentDocument,
} from './schemas/research-document.schema';
import { CreateResearchDocumentDto } from './dto/create-research-document.dto';
import { UpdateResearchDocumentDto } from './dto/update-research-document.dto';

@Injectable()
export class ResearchDocumentsRepository {
  constructor(
    @InjectModel(ResearchDocument.name)
    private readonly researchDocumentModel: Model<ResearchDocumentDocument>,
  ) {}

  async create(
    createResearchDocumentDto: CreateResearchDocumentDto,
  ): Promise<ResearchDocument> {
    const createdDocument = new this.researchDocumentModel(
      createResearchDocumentDto,
    );
    return await createdDocument.save();
  }

  async findAll(): Promise<ResearchDocument[]> {
    return await this.researchDocumentModel.find().exec();
  }

  async findByProjectId(projectId: number): Promise<ResearchDocument[]> {
    return await this.researchDocumentModel.find({ projectId }).exec();
  }

  async findById(id: string): Promise<ResearchDocument> {
    return await this.researchDocumentModel.findById(id).exec();
  }

  async searchByText(searchTerm: string): Promise<ResearchDocument[]> {
    return await this.researchDocumentModel
      .find({ $text: { $search: searchTerm } })
      .exec();
  }

  async searchByTags(tags: string[]): Promise<ResearchDocument[]> {
    return await this.researchDocumentModel
      .find({ tags: { $in: tags } })
      .exec();
  }

  async update(
    id: string,
    updateResearchDocumentDto: UpdateResearchDocumentDto,
  ): Promise<ResearchDocument> {
    return await this.researchDocumentModel
      .findByIdAndUpdate(id, updateResearchDocumentDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ResearchDocument> {
    return await this.researchDocumentModel.findByIdAndDelete(id).exec();
  }

  async countByProjectId(projectId: number): Promise<number> {
    return await this.researchDocumentModel
      .countDocuments({ projectId })
      .exec();
  }

  async findExpansionProjectDocuments(
    projectIds: number[],
  ): Promise<ResearchDocument[]> {
    return await this.researchDocumentModel
      .find({ projectId: { $in: projectIds } })
      .exec();
  }

  async count(): Promise<number> {
    return await this.researchDocumentModel.countDocuments().exec();
  }
}
