import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Get all movies
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.moviesService.findAllWithPagination(pageNumber, limitNumber);
  }

  // Get movie by ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    const movie = this.moviesService.findOne(+id);
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);
    return movie;
  }

  // Create movie with image
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        publishYear: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Body() dto: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const movieData = {
      ...dto,
      image: file.filename,
    };
    return this.moviesService.create(movieData as any);
  }

  // Update movie (optional new image)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        publishYear: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateMovieDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateData = { ...dto };
    if (file) {
      updateData.image = file.filename;
    }
    return this.moviesService.update(+id, updateData);
  }
}
