import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
// import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user);
    // done(null, {id: user.id}); //whatever we want to store in session.
  }

  deserializeUser(payload: any, done: (err: Error, payload: string) => void): any {
    // const user = this.UsersService.findOne(payload.username);
    // done(null, user); //remove from session specific record.
    done(null, payload);


  }
}