import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResearchDocumentDocument = ResearchDocument & Document;

@Schema({ timestamps: true })
export class ResearchDocument {
  id: string; //Explicitly add id property for TypeScript compatibility

  @Prop({ required: true })
  projectId: number; //Reference to MySQL Project.id

  @Prop({ required: true, maxlength: 500 })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ maxlength: 255 })
  author: string;

  @Prop({ maxlength: 50 })
  fileType: string;

  @Prop({ maxlength: 10 })
  language: string;

  @Prop({
    type: {
      pageCount: { type: Number, default: 0 },
      wordCount: { type: Number, default: 0 },
      version: { type: String, default: '1.0' },
      category: { type: String, default: 'general' },
    },
    default: {},
  })
  metadata: {
    pageCount: number;
    wordCount: number;
    version: string;
    category: string;
  };
}

export const ResearchDocumentSchema =
  SchemaFactory.createForClass(ResearchDocument);

//Create indexes for better search performance
ResearchDocumentSchema.index({ projectId: 1 });
ResearchDocumentSchema.index({ title: 'text', content: 'text' });
ResearchDocumentSchema.index({ tags: 1 });
ResearchDocumentSchema.index({ author: 1 });
