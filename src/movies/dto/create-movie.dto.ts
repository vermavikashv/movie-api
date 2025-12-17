import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  title!: string; // <-- note the ! here

  @ApiProperty()
  @IsNumber()
  publishYear!: number; // <-- add !

  @ApiProperty()
  @IsString()
  image!: string; // <-- add !
}
