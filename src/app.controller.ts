import { Controller, Get, Post, Body, Req, Res, Param, Session, ParseIntPipe, HttpException, BadRequestException, HttpStatus, UseGuards, Headers, UnauthorizedException, ForbiddenException, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response, response } from 'express';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { loginUserDto } from './users/dto/login-user.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { StoreOtpDto } from './users/otps/dto/store-otp.dto';
import { VerifyUserDto } from './users/dto/verify-user.dto';
import { CreateCredentialUserDto } from './users/dto/create-credential-user.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';

@Controller()
export class AppController {
  constructor(
    private readonly AuthService: AuthService,
    private readonly appService: AppService,
  ) {}

  /**
   * 
   * @param body have username and password
   * @returns login message
   * This api is for login.
   */
  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async login(@Body() body: loginUserDto) {
    return {msg: 'Logged In!'}; 
  }

  /**
   * 
   * @param req 
   * @param res 
   * This api is for logout.
   */
  @UseGuards(AuthenticatedGuard)
  @Post('user/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(null);
    res.clearCookie('nearShop_sessions', { path: '/'});
    res.end("You are logout");
  }

  /**
   * @param headers 
   * @param body (country, mobile,type)
   * @returns success/fail message
   * This api is for registration. base on mobile number we sent otp for verification.
   */
  @Post('user/registration')
  async create(@Headers() headers, @Body() body: CreateUserDto) {
    var responseData = {status:"failed",message:"Something went wrong! OTP is not delivered."};
    const isOtpSent = await this.AuthService.userRegistration(body);
    if(isOtpSent){
      responseData.status = "success";
      responseData.message = "Otp is sent on your " + body.mobile + " mobile number.";
    }
    return responseData;
  }

   /**
   * @param headers 
   * @param body (country, mobile, type)
   * @returns success/fail message
   * This api is for registration. base on mobile number we sent otp for verification.
   */
  @Post('user/verification')
  async verification(@Headers() headers, @Body() body: VerifyUserDto) {
    var responseData = {status:"failed",message:"Something went wrong! OTP is not verified."};
    const isOtpVerified = await this.AuthService.otpVerification(body);
    if(isOtpVerified){
      responseData.status = "success";
      responseData.message = "Otp is verified for " + body.mobile + " mobile number.";
    }
    return responseData;
  }

  @Post('user/createCredential')
  async createCredential(@Headers() headers, @Body() body: CreateCredentialUserDto) {
    var responseData = {status:"failed",message:"Something went wrong! Credential not created."};
    const isCreatedCredential = await this.AuthService.createCredential(body);
    console.log(isCreatedCredential);
    if(isCreatedCredential) {
      responseData.status = "success";
      responseData.message = "User credential is created. please make it confidential."
    }
    return responseData;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('user/updateProfile')
  async updateProfile(@Headers() headers, @Body() body: UpdateUserDto) {
    var responseData = {status:"failed",message:"Something went wrong! User profile is not updated."};
    const isUpdatedUser = await this.AuthService.updateUserProfile(body);
    if(isUpdatedUser){
      responseData.status = "success";
      responseData.message = "User profile is updated";
    }
    return responseData;
  }

  @Get()
  getHello(): any {
    throw new BadRequestException({
      status: 654,
      error: 'This is a custom message',
    });
  }

  @Get('auth/login/search/:id')
  searchUser(@Param('id', ParseIntPipe) id: number) { //no need to put req res in every function
    const userId = id;
    throw new HttpException("Customer Id not found", HttpStatus.BAD_REQUEST);
    if (userId) {
      return userId;
    } else {
      throw new HttpException("Customer Id not found", HttpStatus.BAD_REQUEST);
    }
  }
}
