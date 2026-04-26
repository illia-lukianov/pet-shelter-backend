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

    const lastRequest = await this.prisma.adoptionRequest.findFirst({
      where: {
        OR: [{ userId }, { email: user.email }],
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log("🚀 ~ UserService ~ getAdoptionPreset ~ lastRequest:", lastRequest)

    return {
      fullName: lastRequest?.fullName || user.email.split('@')[0],
      phone: lastRequest?.phone || '',
      email: user.email,
      experience: lastRequest?.experience || '',
    };
  }
}
