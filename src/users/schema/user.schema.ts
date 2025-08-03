import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Job } from 'src/job/schema/job.schema';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  })
  email: string;
  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: Job.name,
    default: [],
  })
  jobs: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
