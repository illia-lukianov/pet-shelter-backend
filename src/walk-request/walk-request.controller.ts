import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateWalkRequestDto } from './dto/create-walk-request.dto';
import { WalkRequestService } from './walk-request.service';

@Controller('walk-requests')
export class WalkRequestController {
  constructor(private readonly walkRequestService: WalkRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() body: CreateWalkRequestDto,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.walkRequestService.create(body, req.user?.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.walkRequestService.findAll();
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.walkRequestService.remove(id);
  }
}
