import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class WeatherRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Object, required: true })
  location: {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };

  @Prop({ type: Object, required: true })
  weather: Record<string, any>;

  @Prop({ required: true })
  provider: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const WeatherRecordSchema = SchemaFactory.createForClass(WeatherRecord);
