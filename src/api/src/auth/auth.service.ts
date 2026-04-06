import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(userId: string) {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  validateUser(userId: string) {
    // בעבר בדוק מול DB
    return { userId };
  }
}
