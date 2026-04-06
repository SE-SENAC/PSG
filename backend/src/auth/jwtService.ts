import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sign(payload: any, options?: any) {
    return await this.jwtService.sign(payload, options);
  }

  async verify(token: string) {
    return await this.jwtService.verify(token);
  }

  async decode(token: string) {
    return await this.jwtService.decode(token);
  }

  async signRefreshToken(payload: any) {
    return await this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  async verifyRefreshToken(token: string) {
    return await this.jwtService.verify(token);
  }

  async decodeRefreshToken(token: string) {
    return await this.jwtService.decode(token);
  }

  async signAccessToken(payload: any) {
    return await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }
}
