import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Get('adoption-preset')
  @UseGuards(JwtAuthGuard)
  async getPreset(@Req() req) {
    return this.UserService.getAdoptionPreset(req.user.id);
  }
}
