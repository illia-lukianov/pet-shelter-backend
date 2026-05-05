import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateWalkRequestDto } from './dto/create-walk-request.dto';

@Injectable()
export class WalkRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWalkRequestDto, userId?: number) {
    return this.prisma.walkRequest.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        date: dto.date,
        returnDate: dto.returnDate,
        time: dto.time,
        returnTime: dto.returnTime,
        message: dto.message,
        dog: { connect: { id: dto.dogId } },
        user: userId ? { connect: { id: userId } } : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.walkRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { dog: true, user: true },
    });
  }

  async remove(id: number) {
    await this.prisma.walkRequest.delete({
      where: { id },
    });
    return { success: true };
  }
}
