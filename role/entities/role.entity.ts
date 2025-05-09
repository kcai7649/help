import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { asyncExists } from 'src/common/validators/async-exists.validator'

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['system', 'organization'] })
  scope: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', validate: asyncExists('Organization') })
  organization_id?: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
