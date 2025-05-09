import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['prime', 'subcontractor', 'client', 'system'] })
  type: string;

  @Prop()
  address?: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: false })
  parentOrganizationId?: Types.ObjectId;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);