import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { BreedController } from './breed.controller';
import { BreedService } from './breed.service';

@Module({
  imports: [PrismaModule],
  controllers: [BreedController],
  providers: [BreedService],
})
export class BreedModule {}
