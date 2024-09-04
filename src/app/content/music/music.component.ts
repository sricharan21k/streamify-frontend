import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { PascalcasePipe } from '../../pipes/pascalcase.pipe';
import { Data, RouterLink } from '@angular/router';
import { MusicGenre } from '../../model/audio/music-genre';
import { HttpBackend } from '@angular/common/http';
import { MusicArtist } from '../../model/audio/music-artist';
import { MusicService } from '../../services/music.service';
import { Album } from '../../model/audio/album';
import { MediaService } from '../../services/media.service';
import { AppService } from '../../services/app.service';
import { UserService } from '../../services/user.service';
import { fadeInOutAnimation } from '../../animations/fade-animations';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [CommonModule, PascalcasePipe, RouterLink],
  animations: [fadeInOutAnimation],
  templateUrl: './music.component.html',
  styleUrl: './music.component.css',
})
export class MusicComponent implements OnInit {
  @ViewChild('releaseContent') movieContent!: ElementRef<HTMLDivElement>;
  @ViewChild('trendingContent') trendingContent!: ElementRef<HTMLDivElement>;
  @ViewChild('artistContent') showContent!: ElementRef<HTMLDivElement>;
  @ViewChild('albumContent') musicContent!: ElementRef<HTMLDivElement>;

  @ViewChildren('releaseTextElements') releaseTextElements!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('trendingTextElements') trendingTextElements!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('artistTextElements') artistTextElements!: QueryList<
    ElementRef<HTMLDivElement>
  >;

  overflow: { list: string; index: number } = { list: '', index: -1 };

  showLeftButtons = [false, false, false, false];
  showRightButtons = [false, false, false, false];
  timeouts: any = [null, null, null, null];
  contents: ElementRef<HTMLDivElement>[] = [];

  colors = [
    '#f36a6f',
    '#e8a435',
    '#277e71',
    '#007791',
    '#a3748f',
    '#dcbdcb',
    '#fbceb1',
    '#72e6cb',
    '#76abdf',
    '#9e93a7',
  ];
  $genres: MusicGenre = {};

  artists: MusicArtist[] = [];
  genres: string[] = [];
  releases: Album[] = [];
  topAlbums: Album[] = [];
  topGenres: string[] = [];

  currentTitle = '';
  currentIndex = -1;

  constructor(
    private musicService: MusicService,
    private userService: UserService,
    private appService: AppService,
    private mediaService: MediaService
  ) {}

  ngAfterViewInit() {
    this.contents = [
      this.movieContent,
      this.trendingContent,
      this.showContent,
      this.musicContent,
    ];
  }

  ngOnInit(): void {
    // this.dataService.getMusicGenres().subscribe((data) => (this.genres = data));
    this.musicService
      .getArtists()
      .subscribe((artists) => (this.artists = artists));

    // this.musicService.getGenres().subscribe((genres) => (this.genres = genres));

    this.musicService
      .getNewReleases()
      .subscribe((releases) => (this.releases = releases));

    this.musicService
      .getPopularAlbums()
      .subscribe((albums) => (this.topAlbums = albums));

    this.musicService
      .getPopularGenres()
      .subscribe((genres) => (this.topGenres = genres));
  }

  genreColor(index: number) {
    return this.colors[index];
  }

  playAll(type: string) {
    if (type === 'new') {
      this.musicService.getNewReleases().subscribe((data) => {
        const music = data;
        music.forEach((track) => {
          const item = `${track.id}-album`;
          this.userService.addItemToUserRecentPlays(item).subscribe();
        });
      });
    }
  }

  playNow(id: number) {
    const item = `${id}-album`;
    this.userService.addItemToUserRecentPlays(item).subscribe();
    this.userService.updateLastPlayed('audio');
    this.appService.setShowMiniPlayer(true);
    this.appService.closeMiniPlayer(false);
    this.appService.closeMaxPlayer(true);
    this.mediaService.setContentType('audio');
    this.mediaService.forward('audio');
  }

  addToQueue(id: number) {
    const item = `${id}-album`;
    this.userService.addItemToUserRecentPlays(item).subscribe((data) => {
      // this.mediaService.setMedia(data);
    });
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

  checkOverflow(listType: string, index: number) {
    let el;
    switch (listType) {
      case 'releases':
        el = this.releaseTextElements.toArray()[index].nativeElement;
        break;
      case 'trending':
        el = this.trendingTextElements.toArray()[index].nativeElement;
        break;
      case 'artists':
        el = this.artistTextElements.toArray()[index].nativeElement;
        break;
    }

    if (el!.scrollWidth > el!.clientWidth) {
      this.overflow.list = listType;
      this.overflow.index = index;
    }
  }

  resetOverflow() {
    this.overflow.list = '';
    this.overflow.index = -1;
  }
}
