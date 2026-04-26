import { Module } from '@nestjs/common';
import { TraitsService } from './trait.service';
import { TraitsController } from './trait.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TraitsController],
  providers: [TraitsService],
  exports: [TraitsService],
})
export class TraitsModule {}
