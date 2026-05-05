import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';

@Injectable()
export class AdoptionRequestService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdoptionDto, userId?: number) {
    const dog = await this.prisma.dog.findUnique({
      where: { id: dto.dogId },
    });

    if (!dog) {
      throw new NotFoundException(`Собаку з ID ${dto.dogId} не знайдено`);
    }

    const adoptionRequest = await this.prisma.adoptionRequest.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        experience: dto.experience,
        message: dto.message,
        dogId: dto.dogId,
        userId: userId || null,
      },
      include: {
        dog: true,
      },
    });

    if (userId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          phone: dto.phone,
          experience: dto.experience,
          message: dto.message || null,
        },
      });
    }

    return adoptionRequest;
  }

  async findAll() {
    return this.prisma.adoptionRequest.findMany({
      include: {
        dog: { select: { name: true } },
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.adoptionRequest.update({
      where: { id },
      data: { status: status as any },
      include: {
        dog: { select: { name: true } },
        user: { select: { email: true } },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.adoptionRequest.delete({
      where: { id },
    });
  }
}
