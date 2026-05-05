import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: { id: number; role: Role } },
  ) {
    return this.orderService.create(req.user.id, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: Request & { user: { id: number; role: Role } }) {
    return this.orderService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { id: number; role: Role } },
  ) {
    return this.orderService.findOne(id, req.user);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }
}
