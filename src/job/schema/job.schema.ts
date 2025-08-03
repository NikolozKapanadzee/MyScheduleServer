import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
export class Job {
  @Prop({
    type: String,
    required: true,
  })
  date: string;
  @Prop({
    type: String,
    required: true,
  })
  startTime: string;
  @Prop({
    type: String,
    required: true,
  })
  endTime: string;
  @Prop({
    type: Number,
  })
  totalHours: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  author: mongoose.Schema.Types.ObjectId;
}
export const JobSchema = SchemaFactory.createForClass(Job);
