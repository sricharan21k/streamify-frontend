import { Episode } from './episode';

export interface Show {
  id: number;
  title: string;
  seasons: number;
  episodeList: number[];
  genre: string;
  creator: string;
  composer: string;
  starring: string;
  initialRelease: number;
  rating: number;
  language: string;
  poster: string;
  description: string;
  otherGenres: string;
}
