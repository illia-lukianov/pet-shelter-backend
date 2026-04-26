import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { DogsService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Controller('dogs')
export class DogsController {
  constructor(
    private readonly dogsService: DogsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll() {
    return this.dogsService.findAll();
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
    @UploadedFiles() files: Express.Multer.File[],
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
      images: imageUrls,
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

    const dataToUpdate: any = {
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
}
