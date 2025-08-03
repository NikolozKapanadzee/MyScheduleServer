import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signUp({ email, password }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) throw new BadGatewayException('User Already Exists');
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create({
      email,
      password: hashedPass,
    });
    return {
      message: 'Sign Up Successfully Passed',
      data: {
        _id: newUser._id,
        email: newUser.email,
        jobs: newUser.jobs,
      },
    };
  }
  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel
      .findOne({ email })
      .select('password');
    if (!existUser)
      throw new BadRequestException('Email Or Password Is Incorrect');
    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual) throw new BadRequestException('Invalid Credentials');
    const payload = {
      id: existUser._id,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return {
      message: 'Sign In Passed Successfully',
      data: token,
    };
  }
}
