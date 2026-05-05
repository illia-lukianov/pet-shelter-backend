import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AccessoriesController } from './accessories.controller';
import { AccessoriesService } from './accessories.service';

@Module({
  imports: [PrismaModule],
  controllers: [AccessoriesController],
  providers: [AccessoriesService],
})
export class AccessoriesModule {}
