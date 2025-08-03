import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schema/job.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createJobDto: CreateJobDto, userId?: string) {
    const { date, startTime, endTime } = createJobDto;

    const createJob = await this.jobModel.create({
      date,
      startTime,
      endTime,
      totalHours: createJobDto.totalHours,
      author: userId,
    });
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { jobs: createJob._id } },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User Not Found');
    }
    return {
      message: 'Job Created Successfully',
      data: updatedUser,
    };
  }

  findAll() {
    return this.jobModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
