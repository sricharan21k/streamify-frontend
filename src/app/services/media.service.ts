import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Media } from '../model/media';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private audioElement = new BehaviorSubject<HTMLMediaElement | null>(null);
  private videoElement = new BehaviorSubject<HTMLMediaElement | null>(null);
  private isAudioPlaying = new BehaviorSubject<boolean>(false);
  private isVideoPlaying = new BehaviorSubject<boolean>(false);

  private currentAudioSrc = new BehaviorSubject<string>('');
  private currentVideoSrc = new BehaviorSubject<string>('');

  private loopAudio = new BehaviorSubject<boolean>(false);
  private loopVideo = new BehaviorSubject<boolean>(false);

  private shuffleAudio = new BehaviorSubject<boolean>(false);
  private shuffleVudio = new BehaviorSubject<boolean>(false);

  private fullscreen = new BehaviorSubject<boolean>(false);

  private currentAudioTime = new BehaviorSubject<string>('00:00');
  private currentVideoTime = new BehaviorSubject<string>('00:00');

  private audioDuration = new BehaviorSubject<string>('00:00');
  private videoDuration = new BehaviorSubject<string>('00:00');

  private audioProgress = new BehaviorSubject<number>(0);
  private videoProgress = new BehaviorSubject<number>(0);

  private audioPlaylist: string[] = [];
  private videoPlaylist: string[] = [];

  private currentAudioTrackIndex = new BehaviorSubject<number>(0);
  private currentVideoTrackIndex = new BehaviorSubject<number>(0);

  private audioMedia = new Subject<Media>();
  private videoMedia = new Subject<Media>();

  private contentType = new Subject<string>();

  audioElement$ = this.audioElement.asObservable();
  videoElement$ = this.videoElement.asObservable();

  isAudioPlaying$ = this.isAudioPlaying.asObservable();
  isVideoPlaying$ = this.isVideoPlaying.asObservable();

  currentAudioSrc$ = this.currentAudioSrc.asObservable();
  currentVideoSrc$ = this.currentVideoSrc.asObservable();

  audioLoop$ = this.loopAudio.asObservable();
  videoLoop$ = this.loopVideo.asObservable();

  shuffleAudio$ = this.shuffleAudio.asObservable();
  shuffleVideo$ = this.shuffleVudio.asObservable();

  fullscreen$ = this.fullscreen.asObservable();

  currentAudioTime$ = this.currentAudioTime.asObservable();
  currentVideoTime$ = this.currentVideoTime.asObservable();

  audioDuration$ = this.audioDuration.asObservable();
  videoDuration$ = this.videoDuration.asObservable();

  audioProgress$ = this.audioProgress.asObservable();
  videoProgress$ = this.videoProgress.asObservable();

  currentAudioTrackIndex$ = this.currentAudioTrackIndex.asObservable();
  currentVideoTrackIndex$ = this.currentVideoTrackIndex.asObservable();

  audioMedia$ = this.audioMedia.asObservable();
  videoMedia$ = this.videoMedia.asObservable();

  contentType$ = this.contentType.asObservable();

  setAudioElement(element: HTMLMediaElement) {
    this.audioElement.next(element);
  }

  setVideoElement(element: HTMLMediaElement) {
    this.videoElement.next(element);
  }

  setPlaying(type: string, playing: boolean) {
    if (type === 'audio') {
      this.isAudioPlaying.next(playing);
    } else if (type === 'video') {
      this.isVideoPlaying.next(playing);
    }
  }

  setMediaSrc(type: string, src: string) {
    if (type === 'audio') {
      this.currentAudioSrc.next(src);
    } else if (type === 'video') {
      this.currentVideoSrc.next(src);
    }

    this.loadMedia(type, src);
  }

  setLoop(type: string, loop: boolean) {
    if (type === 'audio') {
      this.loopAudio.next(loop);
    } else if (type === 'video') {
      this.loopVideo.next(loop);
    }
  }

  setShuffle(type: string, shuffle: boolean) {
    if (type === 'audio') {
      this.shuffleAudio.next(shuffle);
    } else if (type === 'video') {
      this.shuffleVudio.next(shuffle);
    }
  }

  setFullscreen(value: boolean) {
    this.fullscreen.next(value);
  }

  setCurrentTime(type: string, time: string) {
    if (type === 'audio') {
      this.currentAudioTime.next(time);
    } else if (type === 'video') {
      this.currentVideoTime.next(time);
    }
  }

  setDuration(type: string, duration: string) {
    if (type === 'audio') {
      this.audioDuration.next(duration);
    } else if (type === 'video') {
      this.videoDuration.next(duration);
    }
  }

  setProgress(type: string, progress: number) {
    if (type === 'audio') {
      this.audioProgress.next(progress);
    } else if (type === 'video') {
      this.videoProgress.next(progress);
    }
  }

  setPlaylist(type: string, playlist: string[]) {
    if (type === 'audio') {
      this.audioPlaylist = playlist;
    } else if (type === 'video') {
      this.videoPlaylist = playlist;
    }
  }

  setCurrentTrackIndex(type: string, index: number) {
    if (type === 'audio') {
      this.currentAudioTrackIndex.next(index);
    } else if (type === 'video') {
      this.currentVideoTrackIndex.next(index);
    }
  }

  setMedia(type: string, media: Media) {
    if (type === 'audio') {
      this.audioMedia.next(media);
    } else if (type === 'video') {
      this.videoMedia.next(media);
    }
  }

  setContentType(type: string) {
    this.contentType.next(type);
  }

  playPause(type: string) {
    let media;
    if (type === 'audio') {
      media = this.audioElement.getValue();
    } else if (type === 'video') {
      media = this.videoElement.getValue();
    }

    if (media) {
      let isPlaying;
      if (type === 'audio') {
        isPlaying = this.isAudioPlaying.getValue();
      } else if (type === 'video') {
        isPlaying = this.isVideoPlaying.getValue();
      }

      if (isPlaying) {
        media.pause();
      } else {
        media.play();
      }
      this.setPlaying(type, !isPlaying);
      this.updateProgress(type);
    }
  }

  forward(type: string) {
    if (type === 'audio') {
      if (this.shuffleAudio.getValue()) {
        this.playRandomTrack(type);
      } else {
        const nextIndex =
          (this.currentAudioTrackIndex.getValue() + 1) %
          this.audioPlaylist.length;
        this.setCurrentTrackIndex(type, nextIndex);
        this.playTrackAtIndex(type, nextIndex);
      }
    } else if (type === 'video') {
      if (this.shuffleVudio.getValue()) {
        this.playRandomTrack(type);
      } else {
        const nextIndex =
          (this.currentVideoTrackIndex.getValue() + 1) %
          this.videoPlaylist.length;
        this.setCurrentTrackIndex(type, nextIndex);
        this.playTrackAtIndex(type, nextIndex);
      }
    }
  }

  backward(type: string) {
    if (type === 'audio') {
      const prevIndex =
        (this.currentAudioTrackIndex.getValue() -
          1 +
          this.audioPlaylist.length) %
        this.audioPlaylist.length;
      this.setCurrentTrackIndex(type, prevIndex);
      this.playTrackAtIndex(type, prevIndex);
    } else if (type === 'video') {
      const prevIndex =
        (this.currentVideoTrackIndex.getValue() -
          1 +
          this.videoPlaylist.length) %
        this.videoPlaylist.length;
      this.setCurrentTrackIndex(type, prevIndex);
      this.playTrackAtIndex(type, prevIndex);
    }
  }

  toggleLoop(type: string) {
    let loop;
    let media;
    if (type === 'audio') {
      loop = !this.loopAudio.getValue();
      media = this.audioElement.getValue();
    } else if (type === 'video') {
      loop = !this.loopVideo.getValue();
      media = this.videoElement.getValue();
    }
    if (loop) {
      this.setLoop(type, loop);
      if (media) {
        media.loop = loop;
      }
    }
  }

  toggleShuffle(type: string) {
    let shuffle;
    if (type === 'audio') {
      shuffle = !this.shuffleAudio.getValue();
    } else if (type === 'video') {
      shuffle = !this.shuffleVudio.getValue();
    }
    if (shuffle) this.setShuffle(type, shuffle);
  }

  toggleFullscreen() {
    const fullscreen = !this.fullscreen.getValue();
    this.setFullscreen(fullscreen);
    const media = this.videoElement.getValue();
    if (media) {
      media.requestFullscreen();
    }
  }

  seek(type: string, time: number) {
    let media;
    if (type === 'audio') {
      media = this.audioElement.getValue();
    } else if (type === 'video') {
      media = this.videoElement.getValue();
    }

    if (media) {
      media.currentTime = time;
    }
  }

  updateProgress(type: string) {
    let media;
    if (type === 'audio') {
      media = this.audioElement.getValue();
    } else if (type === 'video') {
      media = this.videoElement.getValue();
    }

    if (media) {
      const progress = (media.currentTime / media.duration) * 100;
      this.setProgress(type, progress);
      this.setCurrentTime(type, this.formatTime(media.currentTime));
      this.setDuration(type, this.formatTime(media.duration));
    }
  }

  private playTrackAtIndex(type: string, index: number) {
    let src;
    if (type === 'audio') {
      src = this.audioPlaylist[index];
    } else if (type === 'video') {
      src = this.videoPlaylist[index];
    }
    if (src) this.setMediaSrc(type, src);
  }

  private loadMedia(type: string, src: string) {
    let media;
    if (type === 'audio') {
      media = this.audioElement.getValue();
    } else if (type === 'video') {
      media = this.videoElement.getValue();
    }

    if (media) {
      media.src = src;
      media.load();
      media.play();
      this.setPlaying(type, true);
    }
  }

  private playRandomTrack(type: string) {
    let randomIndex;
    if (type === 'audio') {
      randomIndex = Math.floor(Math.random() * this.audioPlaylist.length);
    } else if (type === 'video') {
      randomIndex = Math.floor(Math.random() * this.videoPlaylist.length);
    }
    if (randomIndex) {
      this.setCurrentTrackIndex(type, randomIndex);
      this.playTrackAtIndex(type, randomIndex);
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      secs < 10 ? '0' : ''
    }${secs}`;
  }
}
