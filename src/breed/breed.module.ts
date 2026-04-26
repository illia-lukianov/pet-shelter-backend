import { Module } from '@nestjs/common';
import { BreedService } from './breed.service';
import { BreedController } from './breed.controller';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  controllers: [BreedController],
  providers: [BreedService, PrismaService],
})
export class BreedModule {}
