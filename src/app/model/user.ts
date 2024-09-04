export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  profileImage: string;
  watchHistory: string[];
  watchlist: string[];
  recentPlays: string[];
  playQueue: string[];
}
