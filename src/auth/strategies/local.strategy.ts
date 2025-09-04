import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); //نخلي الـ login بالـ email
  }

  async validate(email: string, password: string): Promise<any> {
    const client = await this.authService.validateClient(email, password);
    if (!client) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return client;
  }
}
