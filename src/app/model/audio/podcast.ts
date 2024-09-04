import { Episode } from '../video/episode';

export interface Podcast {
  id: number;
  title: string;
  topic: string;
  episodes: Episode[];
  host: string;
  initialRelease: number;
  language: string;
  thumbnail: string;
}
