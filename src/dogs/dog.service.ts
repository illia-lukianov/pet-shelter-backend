import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

@Injectable()
export class DogsService {
  constructor(private prisma: PrismaService) {}

  async create(createDogDto: CreateDogDto) {
    const { traitIds, ...dogData } = createDogDto;

    return this.prisma.dog.create({
      data: {
        ...dogData,
        traits: {
          connect: traitIds?.map((id) => ({ id })) || [],
        },
      },
      include: { breed: true, traits: true },
    });
  }

  async findAll(includeAll = false) {
    return this.prisma.dog.findMany({
      where: includeAll ? undefined : { status: 'AVAILABLE' },
      include: { breed: true, traits: true },
    });
  }

  async findOne(id: number) {
    const dog = await this.prisma.dog.findUnique({
      where: { id },
      include: { breed: true, traits: true },
    });
    if (!dog) throw new NotFoundException(`Собаку з ID ${id} не знайдено`);
    return dog;
  }

  async update(id: number, updateDogDto: Partial<UpdateDogDto>) {
    const { traitIds, ...dogData } = updateDogDto;

    const updatePayload: Record<string, unknown> = {
      ...dogData,
    };

    if (traitIds) {
      updatePayload.traits = {
        set: traitIds.map((id) => ({ id })),
      };
    }

    return this.prisma.dog.update({
      where: { id },
      data: updatePayload,
      include: { breed: true, traits: true },
    });
  }

  async remove(id: number) {
    return this.prisma.dog.delete({
      where: { id },
    });
  }
}
