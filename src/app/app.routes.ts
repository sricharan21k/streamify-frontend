import { Routes } from '@angular/router';

import { GamesComponent } from './content/games/games.component';
import { MoviesComponent } from './content/movies/movies.component';
import { MusicComponent } from './content/music/music.component';
import { ShowsComponent } from './content/shows/shows.component';
import { HomeComponent } from './content/home/home.component';
import { PodcastsComponent } from './content/podcasts/podcasts.component';
import { MovieDetailsComponent } from './content/movies/movie-details/movie-details.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileComponent } from './content/profile/profile.component';
import { MusicDetailsComponent } from './content/music/music-details/music-details.component';
import { ShowDetailsComponent } from './content/shows/show-details/show-details.component';
import { PodcastDetailsComponent } from './content/podcasts/podcast-details/podcast-details.component';
import { LoginComponent } from './auth/login/login.component';
import { RecoverComponent } from './auth/recover/recover.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'home', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'movies/:topic', component: MovieDetailsComponent },
  { path: 'movies/genre/:genre', component: MovieDetailsComponent },
  { path: 'movie/:movieId', component: MovieDetailsComponent },
  { path: 'shows', component: ShowsComponent },
  { path: 'shows/:topic', component: ShowDetailsComponent },
  { path: 'shows/genre/:genre', component: ShowDetailsComponent },
  { path: 'show/:showId', component: ShowDetailsComponent },
  { path: 'music', component: MusicComponent },
  { path: 'music/album/:albumId', component: MusicDetailsComponent },
  { path: 'music/genre/:genre/albums', component: MusicDetailsComponent },
  { path: 'music/artist/:artistId/albums', component: MusicDetailsComponent },
  { path: 'music/albums/:topic', component: MusicDetailsComponent },
  { path: 'podcasts', component: PodcastsComponent },
  { path: 'podcasts/topic/:topic', component: PodcastDetailsComponent },
  { path: 'podcasts/category/:category', component: PodcastDetailsComponent },
  { path: 'games', component: GamesComponent },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
