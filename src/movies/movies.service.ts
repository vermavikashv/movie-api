import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  create(movie: Movie) {
    movie.id = Date.now();
    this.movies.push(movie);
    return movie;
  }

  update(id: number, data: Partial<Movie>) {
    const movie = this.movies.find((m) => m.id === id);
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);
    Object.assign(movie, data);
    return movie;
  }

  findAllWithPagination(page = 1, limit = 10) {
    const total = this.movies.length;

    if (total === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = this.movies.slice(startIndex, endIndex);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.movies.find((m) => m.id === id);
  }
}
