import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      usersCount,
      productsCount,
      ordersCount,
      categoriesCount,
      adoptionRequestsCount,
      walkRequestsCount,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.category.count(),
      this.prisma.adoptionRequest.count(),
      this.prisma.walkRequest.count(),
    ]);

    return {
      usersCount,
      productsCount,
      ordersCount,
      categoriesCount,
      adoptionRequestsCount,
      walkRequestsCount,
    };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        phone: true,
        experience: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(dto: CreateAdminUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        role: dto.role,
        phone: dto.phone || null,
        experience: dto.experience || null,
      },
      select: {
        id: true,
        email: true,
        role: true,
        phone: true,
        experience: true,
        createdAt: true,
      },
    });
  }

  async updateUser(id: number, dto: UpdateAdminUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        role: dto.role,
        phone: dto.phone ?? undefined,
        experience: dto.experience ?? undefined,
      },
      select: {
        id: true,
        email: true,
        role: true,
        phone: true,
        experience: true,
        createdAt: true,
      },
    });
  }

  async removeUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
