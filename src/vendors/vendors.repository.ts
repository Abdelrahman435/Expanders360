import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsRepository {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorRepository.create(createVendorDto);
    return await this.vendorRepository.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return await this.vendorRepository.find();
  }

  async findById(id: number): Promise<Vendor> {
    return await this.vendorRepository.findOne({ where: { id } });
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    await this.vendorRepository.update(id, updateVendorDto);
    return await this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.vendorRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.vendorRepository.count();
  }

  async findExpiredSLAs(): Promise<Vendor[]> {
    const today = new Date();
    return await this.vendorRepository.find({
      where: {
        sla_expiry_date: LessThan(today),
      },
    });
  }

  async findSLAsExpiringInDays(days: number): Promise<Vendor[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.vendorRepository.find({
      where: {
        sla_expiry_date: Between(new Date(), futureDate),
      },
    });
  }
}
