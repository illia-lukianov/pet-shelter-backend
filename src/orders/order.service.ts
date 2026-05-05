import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    const productIds = [...new Set(dto.items.map((item) => item.productId))];

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      const foundIds = products.map((product) => product.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Products not found: ${missingIds.join(', ')}`,
      );
    }

    const orderItems = dto.items.map((item) => {
      const product = products.find((product) => product.id === item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ID ${item.productId}`,
        );
      }

      const unitPrice =
        typeof product.price === 'object' && 'toNumber' in product.price
          ? product.price.toNumber()
          : Number(product.price);

      return {
        productId: product.id,
        quantity: item.quantity,
        price: unitPrice,
      };
    });

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: OrderStatus.PENDING,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
          user: { select: { email: true } },
        },
      });

      await Promise.all(
        orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      return createdOrder;
    });

    return order;
  }

  async findAll(requestingUser: { id: number; role: Role }) {
    const where =
      requestingUser.role === Role.ADMIN
        ? undefined
        : { userId: requestingUser.id };

    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true } },
        user: { select: { email: true } },
      },
    });
  }

  async findOne(id: number, requestingUser: { id: number; role: Role }) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { email: true } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (
      requestingUser.role !== Role.ADMIN &&
      order.userId !== requestingUser.id
    ) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.status === dto.status) {
      return order;
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      if (
        order.status !== OrderStatus.CANCELLED &&
        dto.status === OrderStatus.CANCELLED
      ) {
        await Promise.all(
          order.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            }),
          ),
        );
      }

      return tx.order.update({
        where: { id },
        data: { status: dto.status },
        include: {
          items: { include: { product: true } },
          user: { select: { email: true } },
        },
      });
    });

    return updatedOrder;
  }
}
