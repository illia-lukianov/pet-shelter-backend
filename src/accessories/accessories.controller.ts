import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AccessoriesService } from './accessories.service';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Controller('accessories')
export class AccessoriesController {
  constructor(private readonly accessoriesService: AccessoriesService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.accessoriesService.findAll(category);
  }

  @Get('categories')
  findCategories() {
    return this.accessoriesService.findCategories();
  }

  @Post('categories')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createCategory(@Body('name') name: string) {
    return this.accessoriesService.createCategory(name);
  }

  @Patch('categories/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return this.accessoriesService.updateCategory(id, name);
  }

  @Delete('categories/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.accessoriesService.removeCategory(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accessoriesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createAccessoryDto: CreateAccessoryDto) {
    return this.accessoriesService.create(createAccessoryDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccessoryDto: UpdateAccessoryDto,
  ) {
    return this.accessoriesService.update(id, updateAccessoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accessoriesService.remove(id);
  }
}
