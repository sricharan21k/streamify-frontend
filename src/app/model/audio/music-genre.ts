import { Album } from './album';

export interface MusicGenre {
  [genre: string]: Album[];
}
