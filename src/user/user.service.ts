import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAdoptionPreset(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const lastAdoptionRequest = await this.prisma.adoptionRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const lastWalkRequest = await this.prisma.walkRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const fullName =
      lastAdoptionRequest?.fullName ||
      lastWalkRequest?.fullName ||
      user.email.split('@')[0];
    const phone =
      lastAdoptionRequest?.phone || lastWalkRequest?.phone || user.phone || '';

    return {
      fullName,
      phone,
      email: user.email,
      experience: lastAdoptionRequest?.experience || user.experience || '',
      message:
        lastAdoptionRequest?.message ||
        lastWalkRequest?.message ||
        user.message ||
        '',
    };
  }
}
