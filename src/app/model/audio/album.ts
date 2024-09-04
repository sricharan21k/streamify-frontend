export interface Album {
  id: number;
  title: string;
  genre: string;
  year: number;
  isSingle: boolean;
  albumCover: string;
  artistName: string;
  artistImage: string;
  tracks: number[];
}
