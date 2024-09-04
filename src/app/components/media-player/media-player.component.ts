import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Media } from '../../model/media';
import { AppService } from '../../services/app.service';
import { MediaService } from '../../services/media.service';
import { UserService } from '../../services/user.service';
import { slideDownAnimation } from '../../animations/slide-animation';

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [CommonModule],
  animations: [slideDownAnimation],
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css',
})
export class MediaPlayerComponent {
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLMediaElement>;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLMediaElement>;
  @ViewChild('textElement') textElement!: ElementRef<HTMLMediaElement>;
  textOverflow = false;
  isAudioPlaying = false;
  isVideoPlaying = false;
  loopAudio = false;
  loopvideo = false;
  shuffleAudio = false;
  shuffleVideo = false;
  draggingAudio = false;
  draggingVideo = false;

  currentAudioSrc = '/assets/audio/alibaba.mp3';
  currentVideoSrc = '/assets/video/gvk.mp4';

  currentAudioTime = '00:00';
  currentVideoTime = '00:00';
  audioDuration = '00:00';
  videoDuration = '00:00';
  audioProgress = 0;
  videoProgress = 0;

  contentType = '';

  currentAudioMedia?: Media;
  currentVideoMedia?: Media;

  audioMedia: Media[] = [];
  videoMedia: Media[] = [];

  currentAudioMediaIndex = 0;
  currentVideoMediaIndex = 0;

  audioPlaylist = ['/assets/audio/alibaba.mp3', '/assets/audio/sketchers.mp3'];
  videoPlaylist = ['/assets/video/gvk.mp4', '/assets/video/gvk.mp4'];

  thumbnailUrl = 'assets/images/wall.jpg';
  metadata: any = {};

  showMiniPlayer = true;

  constructor(
    private appService: AppService,
    private mediaService: MediaService,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    const audio = this.audioElement.nativeElement;
    this.mediaService.setAudioElement(audio);
    audio.addEventListener('ended', () => this.mediaService.forward('audio'));
    audio.addEventListener('timeupdate', () =>
      this.mediaService.updateProgress('audio')
    );

    const video = this.videoElement.nativeElement;
    this.mediaService.setVideoElement(video);
    video.addEventListener('ended', () => this.mediaService.forward('video'));
    video.addEventListener('timeupdate', () =>
      this.mediaService.updateProgress('video')
    );
  }

  ngAfterViewChecked() {
    this.checkOverflow();
    this.cd.detectChanges();
  }

  ngOnInit() {
    // Initialize media
    this.userService.getLastPlayed().subscribe((res) => {
      if (res.data === 'audio') {
        this.contentType = 'audio';
        this.mediaService.setPlaylist(this.contentType, this.audioPlaylist);
        this.userService.getUserRecentPlays().subscribe((recentsData) => {
          this.currentAudioMedia = recentsData[0];
          this.userService.getUserPlayQueue().subscribe((queueData) => {
            if (!recentsData.length) {
              this.appService.setShowMiniPlayer(false);
              this.appService.closeMiniPlayer(true);
            }
            // queueData.forEach((item) => this.audioMedia.push(item));
            // this.audioMedia = [];
            this.audioMedia = queueData;
          });
        });
      } else if (res.data === 'video') {
        this.contentType = 'video';
        this.mediaService.setPlaylist(this.contentType, this.videoPlaylist);
        this.userService.getUserWatchHistory().subscribe((historyData) => {
          this.currentVideoMedia = historyData[0];
          this.userService.getUserWatchlist().subscribe((watchlistData) => {
            if (!historyData.length) {
              this.appService.setShowMiniPlayer(false);
              this.appService.closeMiniPlayer(true);
            }
            // watchlistData.forEach((item) => this.videoMedia.push(item));
            // this.videoMedia = [];
            this.videoMedia = watchlistData;
          });
        });
      } else {
        this.appService.setShowMiniPlayer(false);
        this.appService.closeMiniPlayer(true);
      }
    });

    // Content type
    this.mediaService.contentType$.subscribe((type) => {
      this.contentType = type;
      if (this.contentType === 'audio') {
        this.mediaService.setPlaylist('audio', this.audioPlaylist);
        this.userService.getUserRecentPlays().subscribe((data) => {
          // this.currentAudioMedia = data[0];
          this.audioMedia = data;
        });
      } else if (this.contentType === 'video') {
        this.mediaService.setPlaylist('video', this.videoPlaylist);
        this.userService.getUserWatchHistory().subscribe((data) => {
          // this.currentVideoMedia = data[0];
          this.videoMedia = data;
        });
      }
    });

    this.appService.$showMiniPlayer.subscribe((show) => {
      this.showMiniPlayer = show;
    });

    this.mediaService.audioMedia$.subscribe((data) => {
      this.currentAudioMedia = data;
      this.userService.getUserPlayQueue().subscribe((data) => {
        this.audioMedia = data;
      });
    });

    this.mediaService.videoMedia$.subscribe((data) => {
      this.currentVideoMedia = data;
      this.userService.getUserWatchlist().subscribe((data) => {
        this.videoMedia = data;
      });
    });

    this.mediaService.currentAudioSrc$.subscribe(
      (src) => (this.currentAudioSrc = src)
    );

    this.mediaService.currentVideoSrc$.subscribe(
      (src) => (this.currentVideoSrc = src)
    );

    this.mediaService.isAudioPlaying$.subscribe(
      (playing) => (this.isAudioPlaying = playing)
    );

    this.mediaService.isVideoPlaying$.subscribe(
      (playing) => (this.isVideoPlaying = playing)
    );

    this.mediaService.audioLoop$.subscribe((loop) => (this.loopAudio = loop));
    this.mediaService.videoLoop$.subscribe((loop) => (this.loopvideo = loop));

    this.mediaService.shuffleAudio$.subscribe(
      (shuffle) => (this.shuffleAudio = shuffle)
    );
    this.mediaService.shuffleVideo$.subscribe(
      (shuffle) => (this.shuffleVideo = shuffle)
    );

    this.mediaService.currentAudioTime$.subscribe(
      (time) => (this.currentAudioTime = time)
    );
    this.mediaService.currentVideoTime$.subscribe(
      (time) => (this.currentVideoTime = time)
    );

    this.mediaService.audioDuration$.subscribe(
      (duration) => (this.audioDuration = duration)
    );
    this.mediaService.videoDuration$.subscribe(
      (duration) => (this.videoDuration = duration)
    );

    this.mediaService.audioProgress$.subscribe(
      (progress) => (this.audioProgress = progress)
    );
    this.mediaService.videoProgress$.subscribe(
      (progress) => (this.videoProgress = progress)
    );
  }

  checkOverflow() {
    if (this.textElement) {
      const el = this.textElement.nativeElement;
      this.textOverflow = el.scrollWidth > el.clientWidth ? true : false;
    } else {
      this.textOverflow = false;
    }
  }

  watchNow(media: Media, index: number) {
    this.currentVideoMedia = media;
    this.currentVideoMediaIndex = index;
    this.mediaService.forward(this.contentType);
  }

  playPause() {
    this.mediaService.playPause(this.contentType);
  }

  nextTrack() {
    if (this.contentType === 'audio') {
      if (this.currentAudioMediaIndex + 1 < this.audioMedia.length) {
        this.currentAudioMediaIndex++;
        const media = this.audioMedia[this.currentAudioMediaIndex];
        this.currentAudioMedia = this.audioMedia[this.currentAudioMediaIndex];
        this.mediaService.forward(this.contentType);
        this.userService
          .addItemToUserRecentPlays(`${media.id}-${media.type}`)
          .subscribe();
      }
    } else if (this.contentType === 'video') {
      if (this.currentVideoMediaIndex + 1 < this.videoMedia.length) {
        this.currentVideoMediaIndex++;
        const media = this.videoMedia[this.currentVideoMediaIndex];
        this.currentVideoMedia = this.videoMedia[this.currentVideoMediaIndex];
        this.mediaService.forward(this.contentType);
        this.userService
          .addItemToUserWatchHistory(`${media.id}-${media.type}`)
          .subscribe();
      }
    }
  }

  previousTrack() {
    if (this.contentType === 'audio') {
      if (this.currentAudioMediaIndex - 1 >= 0) {
        this.currentAudioMediaIndex--;
        const media = this.audioMedia[this.currentAudioMediaIndex];
        this.currentAudioMedia = this.audioMedia[this.currentAudioMediaIndex];
        this.mediaService.backward(this.contentType);
        this.userService
          .addItemToUserRecentPlays(`${media.id}-${media.type}`)
          .subscribe();
      }
    } else if (this.contentType === 'video') {
      if (this.currentVideoMediaIndex - 1 >= 0) {
        this.currentVideoMediaIndex--;
        const media = this.videoMedia[this.currentVideoMediaIndex];
        this.currentVideoMedia = this.videoMedia[this.currentVideoMediaIndex];
        this.mediaService.backward(this.contentType);
        this.userService
          .addItemToUserWatchHistory(`${media.id}-${media.type}`)
          .subscribe();
      }
    }
  }

  toggleLoop() {
    this.mediaService.toggleLoop(this.contentType);
  }

  toggleShuffle() {
    this.mediaService.toggleShuffle(this.contentType);
  }

  onSeekStart(event: MouseEvent) {
    if (this.contentType === 'audio') {
      this.draggingAudio = true;
    } else if (this.contentType === 'video') {
      this.draggingVideo = true;
    }

    this.seekFromEvent(event);
  }

  onCircleGrab(event: MouseEvent) {
    event.stopPropagation();
    if (this.contentType === 'audio') {
      this.draggingAudio = true;
    } else if (this.contentType === 'video') {
      this.draggingVideo = true;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent) {
    if (this.contentType === 'audio') {
      if (this.draggingAudio) {
        this.seekFromEvent(event);
      }
    } else if (this.contentType === 'video') {
      if (this.draggingVideo) {
        this.seekFromEvent(event);
      }
    }
  }

  @HostListener('document:mouseup')
  onDragEnd() {
    if (this.contentType === 'audio') {
      this.draggingAudio = false;
    } else if (this.contentType === 'video') {
      this.draggingVideo = false;
    }
  }

  seekFromEvent(event: MouseEvent) {
    const progressBar: HTMLElement = event.target as HTMLElement;
    const progressBarRect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - progressBarRect.left;
    const totalWidth = progressBarRect.width;
    if (this.contentType === 'audio') {
      this.mediaService.audioElement$
        .subscribe((media) => {
          if (media) {
            const seekTime = (offsetX / totalWidth) * media.duration;
            this.mediaService.seek(this.contentType, seekTime);
            this.mediaService.setProgress(
              this.contentType,
              (seekTime / media.duration) * 100
            );
          }
        })
        .unsubscribe();
    } else if (this.contentType === 'video') {
      this.mediaService.videoElement$
        .subscribe((media) => {
          if (media) {
            const seekTime = (offsetX / totalWidth) * media.duration;
            this.mediaService.seek(this.contentType, seekTime);
            this.mediaService.setProgress(
              this.contentType,
              (seekTime / media.duration) * 100
            );
          }
        })
        .unsubscribe();
    }
  }

  closeMiniPlayer() {
    this.appService.closeMiniPlayer(true);
  }

  showMaxPlayer() {
    this.showMiniPlayer = false;
    this.appService.setShowMiniPlayer(false);
    this.appService.closeMiniPlayer(true);
    this.appService.closeMaxPlayer(false);
  }

  toggleFullscreen() {
    this.mediaService.toggleFullscreen();
  }

  closeMaxPlayer() {
    this.showMiniPlayer = true;
    this.appService.closeMiniPlayer(false);
    this.appService.closeMaxPlayer(true);
  }
}
