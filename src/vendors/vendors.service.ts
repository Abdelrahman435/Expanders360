import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorsRepo: Repository<Vendor>,
  ) {}

  async findByEmail(email: string): Promise<Vendor | undefined> {
    return this.vendorsRepo
      .createQueryBuilder('vendor')
      .addSelect('vendor.passwordHash')
      .where('vendor.email = :email', { email }) // تأكد اسم العمود عندك (email/contact_email)
      .getOne();
  }

  // create/update...
}
