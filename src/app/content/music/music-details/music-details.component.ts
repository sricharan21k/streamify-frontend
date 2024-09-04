import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MusicService } from '../../../services/music.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Album } from '../../../model/audio/album';
import { CommonModule } from '@angular/common';
import { PascalcasePipe } from '../../../pipes/pascalcase.pipe';
import { Song } from '../../../model/audio/song';
import { UserService } from '../../../services/user.service';
import { AppService } from '../../../services/app.service';
import { MediaService } from '../../../services/media.service';
import {
  fadeInAnimation,
  fadeInOutAnimation,
} from '../../../animations/fade-animations';

@Component({
  selector: 'app-music-details',
  standalone: true,
  imports: [CommonModule, PascalcasePipe, RouterLink],
  animations: [fadeInOutAnimation],
  templateUrl: './music-details.component.html',
  styleUrl: './music-details.component.css',
})
export class MusicDetailsComponent implements OnInit {
  selectedAlbum?: Album;
  trackList: Song[] = [];
  albums: Album[] = [];
  artistId: string | null = null;
  albumId: string | null = null;
  genre: string | null = null;
  topic: string | null = null;
  currentTitle: string = '';
  header: string = '';

  constructor(
    private musicService: MusicService,
    private userService: UserService,
    private appService: AppService,
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.artistId = param.get('artistId');
      this.albumId = param.get('albumId');
      this.genre = param.get('genre');
      this.topic = param.get('topic');

      this.handleParams();
    });
  }

  private handleParams() {
    if (this.albumId) {
      this.musicService.getAlbum(+this.albumId).subscribe((album) => {
        this.selectedAlbum = album;
        this.selectedAlbum.tracks.forEach((trackId) => {
          this.musicService.getTrack(trackId).subscribe((track) => {
            this.trackList.push(track);
          });
        });
        this.header = this.selectedAlbum.title;
      });
    }

    if (this.artistId) {
      this.musicService.getArtistAlbums(+this.artistId).subscribe((albums) => {
        this.albums = albums;
        this.header = this.albums[0].artistName;
        console.log('art', albums);
      });
    }

    if (this.genre) {
      this.musicService.getGenreAlbums(this.genre).subscribe((albums) => {
        this.albums = albums;
        this.header = this.genre as string;
      });
    }

    if (this.topic) {
      this.header = this.topic.split('-').join(' ');
      switch (this.topic) {
        case 'new-releases': {
          this.musicService
            .getNewReleases()
            .subscribe((albums) => (this.albums = albums));
          break;
        }
        case 'popular-albums': {
          this.musicService
            .getPopularAlbums()
            .subscribe((albums) => (this.albums = albums));
          break;
        }
        default:
      }
    }
  }

  playNow(id: number) {
    const item = `${id}-album`;
    this.userService.addItemToUserRecentPlays(item);
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
}
