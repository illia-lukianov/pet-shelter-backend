import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('summary')
  @Roles(Role.ADMIN)
  getSummary() {
    return this.adminService.getSummary();
  }

  @Get('users')
  @Roles(Role.ADMIN)
  getUsers() {
    return this.adminService.getUsers();
  }

  @Post('users')
  @Roles(Role.ADMIN)
  createUser(@Body() dto: CreateAdminUserDto) {
    return this.adminService.createUser(dto);
  }

  @Patch('users/:id')
  @Roles(Role.ADMIN)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminUserDto,
  ) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('users/:id')
  @Roles(Role.ADMIN)
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeUser(id);
  }
}
