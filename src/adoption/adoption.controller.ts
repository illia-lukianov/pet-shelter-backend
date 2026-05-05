import {
  Body,
  Controller,
  Delete,
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
import { AdoptionRequestService } from './adoption.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionRequestStatusDto } from './dto/update-adoption-request-status.dto';

@Controller('adoption-request')
export class AdoptionRequestController {
  constructor(private readonly adoptionService: AdoptionRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDto: CreateAdoptionDto,
    @Req() req: Request & { user: { id: number } },
  ) {
    const userId = req.user.id;
    return this.adoptionService.create(createDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.adoptionService.findAll();
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdoptionRequestStatusDto,
  ) {
    return this.adoptionService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adoptionService.remove(id);
  }
}
