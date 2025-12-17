import { ApiProperty } from '@nestjs/swagger';

export class Movie {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  publishYear: number;

  @ApiProperty()
  image: string;
}
