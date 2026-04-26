import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { DogsModule } from './dogs/dog.module';
import { BreedModule } from './breed/breed.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { TraitsModule } from './traits/trait.module';
import { UserModule } from './user/user.module';
import { AdoptionRequestModule } from './adoption/adoption.module';

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
    AdoptionRequestModule,
  ],
})
export class AppModule {}
