import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { emit } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '7d', // Expiração em 7 dias
      secret: process.env.JWT_SECRET,
    })

    return {
      access_token: access_token,
      user: {
        name: user.name,
        email: user.email
      }
    };
  }
}
