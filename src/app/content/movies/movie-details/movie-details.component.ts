import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { Movie } from '../../../model/video/movie';
import { ActivatedRoute, RouterEvent, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PascalcasePipe } from '../../../pipes/pascalcase.pipe';
import { DurationPipe } from '../../../pipes/duration.pipe';
import { MediaService } from '../../../services/media.service';
import { UserService } from '../../../services/user.service';
import { AppService } from '../../../services/app.service';
import { fadeInOutAnimation } from '../../../animations/fade-animations';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, PascalcasePipe, DurationPipe, RouterLink],
  animations: [fadeInOutAnimation],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  selectedMovie?: Movie;
  movies: Movie[] = [];
  header: string = '';
  movieId: string | null = null;
  genre: string | null = null;
  topic: string | null = null;

  constructor(
    private movieService: MovieService,
    private userService: UserService,
    private mediaService: MediaService,
    private appService: AppService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.movieId = param.get('movieId');
      this.genre = param.get('genre');
      this.topic = param.get('topic');

      this.handleParams();
    });
  }

  private handleParams() {
    if (this.movieId) {
      this.movieService
        .getMovie(+this.movieId)
        .subscribe((movie) => (this.selectedMovie = movie));
    }

    if (this.genre) {
      this.movieService.getMoviesOfGenre(this.genre).subscribe((movies) => {
        this.movies = movies;
        this.header = this.genre as string;
      });
    }

    if (this.topic) {
      this.header = this.topic.split('-').join(' ');
      switch (this.topic) {
        case 'new-releases': {
          this.movieService
            .getNewReleases()
            .subscribe((movies) => (this.movies = movies));
          break;
        }
        case 'popular': {
          this.movieService
            .getNewReleases()
            .subscribe((movies) => (this.movies = movies));
          break;
        }
        default:
      }
    }
  }

  getCrewMember(crew: string, department: string) {
    const members = crew.split(',');
    let crewMember = '';
    members.forEach((member) => {
      const deptAndMember = member.split(':');
      if (deptAndMember[0].toLowerCase() === department) {
        crewMember = deptAndMember[1];
      }
    });
    return crewMember;
  }

  watchNow(id: number) {
    const item = `${id}-movie`;
    this.userService
      .addItemToUserWatchHistory(item)
      .subscribe((historyData) => {
        this.userService.updateLastPlayed('video');

        this.appService.setShowMiniPlayer(false);
        this.appService.closeMiniPlayer(true);
        this.appService.closeMaxPlayer(false);

        this.mediaService.setMedia('video', historyData[0]);
        this.mediaService.setContentType('video');
        this.mediaService.forward('video');
      });
  }

  addToWatchlist(id: number) {
    const item = `${id}-movie`;
    this.userService.addItemToUserWatchlist(item).subscribe((data) => {
      // this.mediaService.setMedia(data);
    });
  }
}
