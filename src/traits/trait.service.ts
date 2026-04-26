import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTraitDto } from './dto/create-trait.dto';

@Injectable()
export class TraitsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.trait.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(createTraitDto: CreateTraitDto) {
    return this.prisma.trait.create({
      data: createTraitDto,
    });
  }

  async remove(id: number) {
    return this.prisma.trait.delete({
      where: { id },
    });
  }
}