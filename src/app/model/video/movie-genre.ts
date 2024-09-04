import { Movie } from './movie';

export interface MovieGenre {
  [genre: string]: Movie[];
}
