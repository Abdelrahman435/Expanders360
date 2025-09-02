import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepo: Repository<Client>,
  ) {}

  // CREATE
  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepo.create(createClientDto); // instance واحد
    return await this.clientsRepo.save(client); // بيرجع Client واحد
  }

  // FIND ALL
  async findAll(): Promise<Client[]> {
    return await this.clientsRepo.find();
  }

  // FIND ONE
  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepo.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  // UPDATE
  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    const updated = Object.assign(client, updateClientDto);
    return await this.clientsRepo.save(updated);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const result = await this.clientsRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }
}
