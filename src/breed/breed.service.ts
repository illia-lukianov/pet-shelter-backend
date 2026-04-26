import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';

@Injectable()
export class BreedService {
  constructor(private prisma: PrismaService) {}

  async create(createBreedDto: CreateBreedDto) {
    return this.prisma.breed.create({
      data: createBreedDto,
    });
  }

  async findAll() {
    return this.prisma.breed.findMany();
  }

  async findOne(id: number) {
    const breed = await this.prisma.breed.findUnique({
      where: { id },
    });
    if (!breed) throw new NotFoundException(`Породу з ID ${id} не знайдено`);
    return breed;
  }

  async update(id: number, updateBreedDto: UpdateBreedDto) {
    return this.prisma.breed.update({
      where: { id },
      data: updateBreedDto,
    });
  }

  async remove(id: number) {
    return this.prisma.breed.delete({
      where: { id },
    });
  }
}
