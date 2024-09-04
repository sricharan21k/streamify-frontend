import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { MusicService } from '../../services/music.service';
import { Movie } from '../../model/video/movie';
import { Album } from '../../model/audio/album';
import { Router, RouterLink } from '@angular/router';
import { PascalcasePipe } from '../../pipes/pascalcase.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { UserService } from '../../services/user.service';
import { Podcast } from '../../model/audio/podcast';
import { MediaType } from '../../enum/MediaType';
import { Show } from '../../model/video/show';
import { Song } from '../../model/audio/song';
import { MediaService } from '../../services/media.service';
import { AppService } from '../../services/app.service';
import { fadeInOutAnimation } from '../../animations/fade-animations';
import { Media } from '../../model/media';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PascalcasePipe, DurationPipe],
  animations: [fadeInOutAnimation],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild('movieContent') movieContent!: ElementRef<HTMLDivElement>;
  @ViewChild('showContent') showContent!: ElementRef<HTMLDivElement>;
  @ViewChild('musicContent') musicContent!: ElementRef<HTMLDivElement>;

  showLeftButtons = [false, false, false];
  showRightButtons = [false, false, false];
  timeouts: any = [null, null, null];
  contents: ElementRef<HTMLDivElement>[] = [];

  items: number[] = [1, 2, 3, 4, 5];
  topic?: string;
  widths = [];
  currentCarouselItemIndex = 1;
  interval: any;
  hideCarousel = false;
  currentIndex = -1;
  currentBackgroundIndex = -1;
  backgroundBlur = false;

  newReleases = [];
  movies: Movie[] = [];
  music: Album[] = [];

  constructor(
    private movieService: MovieService,
    private musicService: MusicService,
    private userService: UserService,
    private mediaService: MediaService,
    private appService: AppService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.contents = [this.movieContent, this.showContent, this.musicContent];
  }

  ngOnInit(): void {
    this.startCarousel();

    this.musicService
      .getNewReleases()
      .subscribe((music) => (this.music = music));
    this.movieService
      .getNewReleases()
      .subscribe((movies) => (this.movies = movies));
  }

  startCarousel() {
    this.interval = setInterval(() => {
      this.currentCarouselItemIndex =
        (this.currentCarouselItemIndex + 1) % this.items.length;
    }, 5000);
  }

  playNow(id: number, type: string) {
    const item = `${id}-${type}`;
    this.userService.addItemToUserRecentPlays(item).subscribe((recentData) => {
      this.userService.updateLastPlayed('audio');

      this.appService.setShowMiniPlayer(false);
      this.appService.closeMiniPlayer(true);
      this.appService.closeMaxPlayer(false);

      console.log('aud', recentData);
      this.mediaService.setMedia('audio', recentData[0]);
      this.mediaService.setContentType('audio');
      this.mediaService.playPause('audio');
    });
  }

  addToQueue(id: number, type: string) {
    const item = `${id}-${type}`;
    this.userService.addItemToUserPlayQueue(item).subscribe((data) => {
      // this.mediaService.setMedia(data);
    });
    this.mediaService.setContentType('audio');
  }

  watchNow(id: number, type: string) {
    const item = `${id}-${type}`;
    this.userService
      .addItemToUserWatchHistory(item)
      .subscribe((historyData) => {
        this.userService.updateLastPlayed('video');

        this.appService.setShowMiniPlayer(false);
        this.appService.closeMiniPlayer(true);
        this.appService.closeMaxPlayer(false);

        this.mediaService.setMedia('video', historyData[0]);
        this.mediaService.setContentType('video');
        this.mediaService.playPause('video');
      });
  }

  addToWatchlist(id: number, type: string) {
    const item = `${id}-${type}`;
    this.userService.addItemToUserWatchlist(item).subscribe((data) => {});
  }

  goToMoviePage(id: number) {
    this.router.navigateByUrl(`/movie/${id}`);
  }

  onMouseMove(event: MouseEvent, index: number) {
    const containerWidth = this.contents[index].nativeElement.clientWidth;
    const containerRect =
      this.contents[index].nativeElement.getBoundingClientRect();
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
    this.contents[index].nativeElement.scrollBy({
      left: -this.contents[index].nativeElement.clientWidth * 0.5,
      behavior: 'smooth',
    });
  }

  scrollRight(index: number) {
    this.contents[index].nativeElement.scrollBy({
      left: this.contents[index].nativeElement.clientWidth * 0.5,
      behavior: 'smooth',
    });
  }

  resetTimeout(index: number) {
    clearTimeout(this.timeouts[index]);
    this.timeouts[index] = setTimeout(() => {
      this.showLeftButtons[index] = false;
      this.showRightButtons[index] = false;
    }, 5000);
  }
}
