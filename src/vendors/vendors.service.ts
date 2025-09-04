import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async findAll() {
    return this.vendorRepository.find();
  }

  async createVendor(dto: any) {
    const vendor = this.vendorRepository.create({
      name: dto.name,
      countries_supported: dto.countries_supported,
      services_offered: dto.services_offered,
      rating: dto.rating,
      response_sla_hours: dto.response_sla_hours,
    });
    return this.vendorRepository.save(vendor);
  }
}
