import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Otp, OtpDocument } from 'src/schemas/otp.schema';
import { CreateCredentialUserDto } from './dto/create-credential-user.dto';

export type UserType = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createNewUser(createUserDto: CreateUserDto): Promise<UserType> {
    const createdUser = await this.userModel.insertMany([{
      'first_name': null,
      'last_name': null,
      'email': null,
      'age': null,
      'username': null,
      'password': null,
      'country': createUserDto.country,
      'mobile':createUserDto.mobile,
      'type':createUserDto.type
    }]);
    return createdUser;
  }

  async findAll(): Promise<UserType[]> {
    return await this.userModel.find().exec();
  }

  async findOne(mobile: number): Promise<UserType> {
    return await this.userModel.findOne({ mobile: mobile }).exec();
  }

  async findOneUser(username: string): Promise<UserType> {
    return await this.userModel.findOne({ username: username }).exec();
  }

  async checkMobileNumberExist(requestMobile: string): Promise<boolean> {
    var responseFlag = false;
    var user = await this.userModel.findOne({
      mobile: requestMobile
    }).exec();
    if(user) { responseFlag = true; }
    return responseFlag;
  }

  async checkEmailExist(requestEmail: string): Promise<boolean> {
    var responseFlag = false;
    var user = await this.userModel.findOne({
      email: requestEmail
    }).exec();
    if(user) { responseFlag = true; }
    return responseFlag;
  }

  async createCredential(requestData: CreateCredentialUserDto) {
    var responseFlag = false;
    var user = await this.userModel.findOneAndUpdate(
      {
        mobile: requestData.mobile
      },
      {
        'username'  : requestData.username,
        'password'  : requestData.password
      }
    ).exec();
    console.log(user);
    if(user) { responseFlag = true; }
    return responseFlag;
  }
  async updateUser(mobile: number, updateUserDto: UpdateUserDto) {
    var responseFlag = false;
    var user = await this.userModel.findOneAndUpdate(
      {
        mobile: mobile
      },
      {
        'first_name': updateUserDto.first_name,
        'last_name' : updateUserDto.last_name,
        'email'     : updateUserDto.email,
        'age'       : updateUserDto.age
      }
    ).exec();
    if(user) { responseFlag = true; }
    return responseFlag;
  }

  async remove(id: number) {
    const deleteUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deleteUser;
  }

  // private readonly users: Users[];
}
