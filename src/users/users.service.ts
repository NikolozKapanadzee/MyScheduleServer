import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('User Already Exists');
    }
    const newUser = await this.userModel.create({ email, password });
    return {
      message: 'User Created Successfully',
      data: newUser,
    };
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Wrong ID Format');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Wrong ID Format');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      throw new NotFoundException('User Not Found');
    }
    return {
      message: 'user updated successfully',
      data: updatedUser,
    };
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Wrong ID Format');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('User Not Found');
    }
    return {
      message: 'User Deleted Successfully',
      data: deletedUser,
    };
  }
}
