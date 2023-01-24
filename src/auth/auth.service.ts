import { ConflictException, Injectable, NotFoundException, Req, Session } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { OtpsService } from 'src/users/otps/otps.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpsService: OtpsService,
    // private readonly jwtService: JwtService,
  ) {}

  async userRegistration(requestData: any): Promise<boolean> {
    var responseFlag = false;
    if(typeof requestData.mobile === 'undefined') {
      throw new NotFoundException({
        status:404,
        error: 'Not found mobile number.'
      });
    }

    // check mobile number duplicated.
    if(await this.usersService.checkMobileNumberExist(requestData.mobile)) {
      throw new ConflictException({
        status:500,
        error: 'Sorry! Mobile number is already registered. Please use correct mobile number.'
      });
    }

    // check otp is already sent or not for specific mobile number.
    if(await this.otpsService.isOtpAlreadySent(requestData.mobile)) {
      throw new ConflictException({
        status:500,
        error: 'Otp is already sent.'
      });
    }
    const otp = Math.floor(Math.random()*1000000);
    const hashedOtp = await bcrypt.hash(otp.toString(), process.env.HASH_KEY);
    //write otp value in session.
    var smsMessage = otp + " is your OTP to create your account in near-shop. Treat this as confidential and do not share with anyone. This OTP is valid for next 10 minutes.";
    const sentOtp = this.sendOTP(requestData.mobile, smsMessage);
    const storedOtp = await this.otpsService.store({mobile:requestData.mobile, otp:hashedOtp });
    if(sentOtp && storedOtp) {
      responseFlag = true;
    }
    console.log(otp);
    return responseFlag;
  }

  async otpVerification(requestData: any): Promise<boolean> {
    var responseFlag = false;
    if(typeof requestData.mobile === 'undefined') {
      throw new NotFoundException({
        status:404,
        error: 'Not found mobile number. Please provide mobile number.'
      });
    }
    

    // check mobile number duplicated.
    if(await this.usersService.checkMobileNumberExist(requestData.mobile)) {
      throw new ConflictException({
        status:500,
        error: 'Sorry! Mobile number is already registered. Please use correct mobile number.'
      });
    }

    // check mobile number otp verified.
    if(await this.otpsService.checkMobileNumberVerified(requestData.mobile)) {
      throw new ConflictException({
        status:500,
        error: 'Hey! OTP verification is already completed for this mobile number.'
      });
    }

    if(typeof requestData.otp === 'undefined') {
      throw new NotFoundException({
        status:404,
        error: 'Not found OTP. Please provide OTP.'
      });
    }
    const hashedOtp = await bcrypt.hash(requestData.otp.toString(), process.env.HASH_KEY);
    const verifiedOtpStatus = await this.otpsService.otpVerification(requestData.mobile, hashedOtp);
    
    if(verifiedOtpStatus) {
      responseFlag = true;
    }
    return responseFlag;
  }

  async createCredential(requestData: any): Promise<boolean> {
    var responseFlag = false;
    if(typeof requestData.mobile === 'undefined') {
      throw new NotFoundException({
        status:404,
        error: 'Not found mobile number.'
      });
    }

    const checkOtpRegistration = await this.otpsService.findOne(requestData.mobile);
    if(!checkOtpRegistration) {
      throw new NotFoundException({ status:404, error: 'Mobile number is not registered. Please first register mobile number.' });
    }

    const checkRegistration = await this.usersService.findOne(requestData.mobile);
    if(!checkRegistration) {
      throw new NotFoundException({ status:404, error: 'Not found mobile number.' });
    }

    requestData.password = await this.hashing(requestData.password);
    const createCredentialStatus = await this.usersService.createCredential(requestData);
    if(createCredentialStatus) {
      responseFlag = true;
    }
    return responseFlag;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneUser(username);
    if(!user){
      throw new NotFoundException();
    }
    const isMatch = (user.password === await this.hashing(password));
    if(!isMatch) {
      throw new NotFoundException();
    }
    return true;
  }

  async updateUserProfile(requestData: any): Promise<boolean> {
    var responseFlag = false;
    if(typeof requestData.mobile === 'undefined') {
      throw new NotFoundException({
        status:404,
        error: 'Not found mobile number'
      });
    }

    // check mobile number duplicated.
    if(!await this.usersService.checkMobileNumberExist(requestData.mobile)) {
      throw new ConflictException({
        status:500,
        error: 'Sorry! User is not created with this mobile number. Please first create profile.'
      });
    }

    // check email duplicated.
    if(typeof requestData.email !== 'undefined') {
      if(await this.usersService.checkEmailExist(requestData.email)) {
        throw new ConflictException({
          status:500,
          error: 'Sorry! This email is already used. Please try with different email.'
        });
      }
    }

    const updateUser = await this.usersService.updateUser(requestData.mobile, requestData);
    if(updateUser) {
      responseFlag = true;
    }
    return responseFlag;
  }

  async hashing(password: string): Promise<string> {
    const saltOrRounds = 10;
    // const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, process.env.SALT);
    return hash;
  }

  async sendOTP(mobile: number, smsMessage: string) {
    return true;
  }
}
