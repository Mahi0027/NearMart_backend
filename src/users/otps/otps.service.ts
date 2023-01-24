import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from 'src/schemas/otp.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UsersService } from '../users.service';
import { StoreOtpDto } from './dto/store-otp.dto';

@Injectable()
export class OtpsService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async store(StoreOtpDto: StoreOtpDto) {
    var moment = require('moment');
    var now = moment();
    const storeOtp = await this.otpModel.insertMany([{
      'mobile'        : StoreOtpDto.mobile,
      'otp'           : StoreOtpDto.otp,
      'attempt'       : 0,
      'status'        :false,
      'validity_start' : parseInt(now.unix(), 10),
      'validity_end'   : parseInt(now.add(10,'minutes').unix(), 10)
    }]);
    return storeOtp;
  }

  async isOtpAlreadySent(mobile: number): Promise<boolean> {
    var responseFlag = false;
    var moment = require('moment');
    var now = parseInt(moment().unix(), 10);
    const otpDetails = await this.otpModel.find({ 
      mobile  : mobile,
      attempt : { $lte: 3 },
      status  : false,
    }).exec();

    if(otpDetails.length>0) {
      for(var index in otpDetails) {
        if(now > otpDetails[index]['validity_start'] && now < otpDetails[index]['validity_end']) {
          responseFlag = true;
          break;
        }
      }
    }
    return responseFlag;
  }

  async otpVerification(mobile: number, otp: string): Promise<any> {
    var responseFlag = false;
    var findMobileFlag = false;
    var findOtpFlag = false;
    var userCreateFlag = false;
    var moment = require('moment');
    var now = parseInt(moment().unix(), 10);
    const otpDetails = await this.otpModel.find({ 
      mobile  : mobile,
      attempt : { $lte: 3 },
      status  : false
    }).exec();

    if(otpDetails.length>0) {
      for(var index in otpDetails) {
        if(now > otpDetails[index]['validity_start'] && now < otpDetails[index]['validity_end']) {
          findMobileFlag = true;
          if(otpDetails[index]['otp'] == otp) {
            const updateStatus = await this.otpModel.updateOne(
              {
                _id: otpDetails[index]['_id']
              },
              { $inc: { attempt: 1 },
                status: true
              }
            );
            if(updateStatus) {
              responseFlag = true;
            }
            findOtpFlag = true;
            break;
          }
          else {
            await this.otpModel.updateOne(
              {
                _id: otpDetails[index]['_id']
              },
                { $inc: { attempt: 1 }},
                { status: false }
            );
          }
        }
      }
    }

    if(responseFlag && findOtpFlag) {
      const isUserCreated = await this.userModel.insertMany([{
        'country': "IN",
        "mobile": mobile,
        "type": "BUYER"
      }]);
      console.log(isUserCreated);
      if(isUserCreated){
        userCreateFlag = true;
      }
    }

    if(!findMobileFlag) {
      throw new NotFoundException({
        status: 404,
        error: "OTP is not generated. Please first create OTP."
      });
    }

    if(!findOtpFlag) {
      throw new NotFoundException({
        status: 404,
        error: "OTP didn't match. Please try with correct OTP." 
      });
    }

    if(!userCreateFlag) {
      throw new NotImplementedException({
        status: 404,
        error: "Not registered your number. Please try again." 
      });
    }
    return responseFlag;
  }

  async checkMobileNumberVerified(mobile: number): Promise<boolean> {
    var responseFlag = false;
    var moment = require('moment');
    var now = parseInt(moment().unix(), 10);
    const otpDetails = await this.otpModel.find({ 
      mobile  : mobile,
      attempt : { $lte: 3 },
      status  : true,
    }).exec();

    if(otpDetails.length>0) {
      responseFlag = true;
    }
    return responseFlag;
  }
  async findOne(mobile: number) {
    return await this.otpModel.findOne(
      { 
        mobile  : mobile,
        attempt : { $lte: 3 },
        status  : true
      }
    ).exec();
  }
}
