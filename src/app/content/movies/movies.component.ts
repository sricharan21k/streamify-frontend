import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MovieGenre } from '../../model/video/movie-genre';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { PascalcasePipe } from '../../pipes/pascalcase.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { Movie } from '../../model/video/movie';
import { AppService } from '../../services/app.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MediaService } from '../../services/media.service';
import { fadeInOutAnimation } from '../../animations/fade-animations';

@Component({
  selector: 'app-movies',
  standalone: true,
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
  imports: [
    CommonModule,
    PascalcasePipe,
    DurationPipe,
    RouterLink,
    RouterOutlet,
  ],
  animations: [fadeInOutAnimation],
})
export class MoviesComponent implements OnInit {
  @ViewChildren('content') contents!: QueryList<ElementRef<HTMLDivElement>>;

  showLeftButtons: boolean[] = [];
  showRightButtons: boolean[] = [];
  timeouts: any[] = [];

  genres: MovieGenre = {};
  currentTitle = '';
  showPageContent: boolean = true;
  selectedMovie?: Movie;

  constructor(
    private movieService: MovieService,
    private appService: AppService,
    private userService: UserService,
    private mediaService: MediaService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.contents.forEach((content, index) => {
      this.showLeftButtons[index] = false;
      this.showRightButtons[index] = false;
      this.timeouts[index] = null;
    });
  }

  ngOnInit(): void {
    this.movieService.getGenres().subscribe((data) => (this.genres = data));
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

  onMouseMove(event: MouseEvent, index: number) {
    const content = this.contents.toArray()[index].nativeElement;
    const containerWidth = content.clientWidth;
    const containerRect = content.getBoundingClientRect();
    const mouseX = event.clientX;

    if (mouseX < containerRect.left + containerWidth * 0.125) {
      this.showLeftButtons[index] = true;
      this.resetTimeout(index);
    } else {
      this.showLeftButtons[index] = false;
    }

    if (mouseX > containerRect.right - containerWidth * 0.125) {
      this.showRightButtons[index] = true;
      this.resetTimeout(index);
    } else {
      this.showRightButtons[index] = false;
    }
  }

  scrollLeft(index: number) {
    const content = this.contents.toArray()[index].nativeElement;
    content.scrollBy({ left: -content.clientWidth * 0.5, behavior: 'smooth' });
  }

  scrollRight(index: number) {
    const content = this.contents.toArray()[index].nativeElement;
    content.scrollBy({ left: content.clientWidth * 0.5, behavior: 'smooth' });
  }

  resetTimeout(index: number) {
    clearTimeout(this.timeouts[index]);
    this.timeouts[index] = setTimeout(() => {
      this.showLeftButtons[index] = false;
      this.showRightButtons[index] = false;
    }, 5000);
  }
}
