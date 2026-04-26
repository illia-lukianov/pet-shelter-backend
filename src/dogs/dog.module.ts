import { Module } from '@nestjs/common';
import { DogsService } from './dog.service';
import { DogsController } from './dog.controller';
import { PrismaService } from '../common/prisma/prisma.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Module({
  controllers: [DogsController],
  providers: [DogsService, PrismaService, CloudinaryService],
})
export class DogsModule {}
