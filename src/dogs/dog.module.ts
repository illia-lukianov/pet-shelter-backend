import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { PrismaModule } from '../common/prisma/prisma.module';
import { DogsController } from './dog.controller';
import { DogsService } from './dog.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [DogsController],
  providers: [DogsService],
})
export class DogsModule {}
