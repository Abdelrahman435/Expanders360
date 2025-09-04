import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from '../clients/entities/client.entity';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Client)
    private clientsRepo: Repository<Client>,
  ) {}

  async validateClient(email: string, password: string): Promise<Client> {
    const client = await this.clientsRepo.findOne({
      where: { contact_email: email },
    });
    if (!client) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return client;
  }

  async login(client: Client) {
    const payload = { sub: client.id, role: client.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const client = this.clientsRepo.create({
      ...data,
      password: hashedPassword,
      role: data.role || 'client',
    });
    return this.clientsRepo.save(client);
  }
}
