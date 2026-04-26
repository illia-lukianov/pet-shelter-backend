import { Module } from '@nestjs/common';
import { AdoptionRequestService } from './adoption.service';
import { AdoptionRequestController } from './adoption.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdoptionRequestController],
  providers: [AdoptionRequestService],
})
export class AdoptionRequestModule {}
