import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Injectable()
export class AccessoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    const where = category
      ? {
          category: {
            name: category,
          },
        }
      : undefined;

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category.name,
      categoryId: product.categoryId,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock,
      images: product.images,
      imageUrl: product.images?.[0] ?? null,
    }));
  }

  async create(dto: CreateAccessoryDto) {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description ?? '',
        price: dto.price,
        stock: dto.stock,
        images: dto.images || [],
        categoryId: dto.categoryId,
      },
    });

    const category = await this.prisma.category.findUnique({
      where: { id: product.categoryId },
    });

    return {
      id: product.id,
      name: product.name,
      category: category?.name ?? '',
      categoryId: product.categoryId,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock,
      images: product.images,
      imageUrl: product.images?.[0] ?? null,
    };
  }

  async update(id: number, dto: UpdateAccessoryDto) {
    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      images?: string[];
      categoryId?: number;
    } = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.stock !== undefined) updateData.stock = dto.stock;
    if (dto.images !== undefined) updateData.images = dto.images;
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

    const category = await this.prisma.category.findUnique({
      where: { id: product.categoryId },
    });

    return {
      id: product.id,
      name: product.name,
      category: category?.name ?? '',
      categoryId: product.categoryId,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock,
      images: product.images,
      imageUrl: product.images?.[0] ?? null,
    };
  }

  async remove(id: number) {
    await this.prisma.product.delete({
      where: { id },
    });
    return { success: true };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      id: product.id,
      name: product.name,
      category: product.category.name,
      categoryId: product.categoryId,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock,
      images: product.images,
      imageUrl: product.images?.[0] ?? null,
    };
  }

  async findCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  async createCategory(name: string) {
    return this.prisma.category.create({
      data: {
        name,
      },
    });
  }

  async updateCategory(id: number, name: string) {
    return this.prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  async removeCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
