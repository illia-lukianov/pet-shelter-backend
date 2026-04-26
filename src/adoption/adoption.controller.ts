import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdoptionRequestService } from './adoption.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';

@Controller('adoption-request')
export class AdoptionRequestController {
  constructor(private readonly adoptionService: AdoptionRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: CreateAdoptionDto, @Req() req: any) {
    const userId = req.user.id;
    return this.adoptionService.create(createDto, userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.adoptionService.findAll();
  }
}
