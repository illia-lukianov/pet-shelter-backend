import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccessoriesModule } from './accessories/accessories.module';
import { AdminModule } from './admin/admin.module';
import { AdoptionRequestModule } from './adoption/adoption.module';
import { AuthModule } from './auth/auth.module';
import { BreedModule } from './breed/breed.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { DogsModule } from './dogs/dog.module';
import { OrderModule } from './orders/order.module';
import { TraitsModule } from './traits/trait.module';
import { UserModule } from './user/user.module';
import { WalkRequestModule } from './walk-request/walk-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule,
    AuthModule,
    PrismaModule,
    DogsModule,
    BreedModule,
    TraitsModule,
    UserModule,
    AccessoriesModule,
    AdoptionRequestModule,
    OrderModule,
    WalkRequestModule,
    AdminModule,
  ],
})
export class AppModule {}
