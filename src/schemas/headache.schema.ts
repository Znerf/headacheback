import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class HeadacheRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  hadHeadache: boolean;

  @Prop({ type: String })
  headacheStartTime?: string;

  @Prop({ type: String })
  headacheEndTime?: string;

  @Prop({ required: true })
  wentOutsideYesterday: boolean;

  @Prop({ required: true })
  drankWaterYesterday: boolean;

  @Prop({ type: String })
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const HeadacheRecordSchema = SchemaFactory.createForClass(HeadacheRecord);
