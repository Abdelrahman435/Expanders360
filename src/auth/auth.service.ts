import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClientsService } from '../clients/clients.service';
import { VendorsService } from '../vendors/vendors.service';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  clientsRepo: any;
  vendorsRepo: any;
  constructor(
    private readonly jwtService: JwtService,
    private readonly clientsService: ClientsService,
    private readonly vendorsService: VendorsService,
  ) {}

  // role: 'client' | 'vendor'
  async validateUser(username: string, password: string) {
    // 1- نشوف هل هو Client
    const client = await this.clientsRepo.findOne({
      where: { contact_email: username },
    });

    if (client && (await bcrypt.compare(password, client.password))) {
      return { ...client, role: 'client' };
    }

    // 2- نشوف هل هو Vendor
    const vendor = await this.vendorsRepo.findOne({
      where: { contact_email: username },
    });

    if (vendor && (await bcrypt.compare(password, vendor.password))) {
      return { ...vendor, role: 'vendor' };
    }

    // 3- لو لا Client ولا Vendor
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // optional: register helper that hashes password
  async registerClient(dto: RegisterDto) {
    const client = this.clientsRepo.create(dto);
    return this.clientsRepo.save(client);
  }
}
