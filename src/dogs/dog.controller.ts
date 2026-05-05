import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DogsService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

@Controller('dogs')
export class DogsController {
  constructor(
    private readonly dogsService: DogsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll(@Query('all') all?: string) {
    return this.dogsService.findAll(all === 'true');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dogsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() createDogDto: CreateDogDto,
  ) {
    const uploadPromises = files.map((file) =>
      this.cloudinaryService.uploadFile(file),
    );
    const results = await Promise.all(uploadPromises);

    const imageUrls = results.map((res) => res.secure_url);

    return this.dogsService.create({
      ...createDogDto,
      age: Number(createDogDto.age),
      breedId: Number(createDogDto.breedId),
      images: imageUrls.length > 0 ? imageUrls : createDogDto.images,
    });
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDogDto: UpdateDogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    let imageUrls: string[] | undefined = undefined;

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinaryService.uploadFile(file),
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((res) => res.secure_url);
    }

    const dataToUpdate: Partial<UpdateDogDto & { images?: string[] }> = {
      ...updateDogDto,
      description: updateDogDto.description,
      age: updateDogDto.age ? Number(updateDogDto.age) : undefined,
      breedId: updateDogDto.breedId ? Number(updateDogDto.breedId) : undefined,
      weight: updateDogDto.weight ? Number(updateDogDto.weight) : undefined,
    };

    if (imageUrls) {
      dataToUpdate.images = imageUrls;
    }

    return this.dogsService.update(id, dataToUpdate);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dogsService.remove(id);
  }
}
