import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { WalkRequestController } from './walk-request.controller';
import { WalkRequestService } from './walk-request.service';

@Module({
  imports: [PrismaModule],
  controllers: [WalkRequestController],
  providers: [WalkRequestService],
})
export class WalkRequestModule {}
