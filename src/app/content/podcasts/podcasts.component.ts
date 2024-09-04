import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PodcastService } from '../../services/podcast.service';
import { Podcast } from '../../model/audio/podcast';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PascalcasePipe } from '../../pipes/pascalcase.pipe';
import { AppService } from '../../services/app.service';
import { MediaService } from '../../services/media.service';
import { UserService } from '../../services/user.service';
import { fadeInOutAnimation } from '../../animations/fade-animations';

@Component({
  selector: 'app-podcasts',
  standalone: true,
  imports: [CommonModule, RouterLink, PascalcasePipe],
  animations: [fadeInOutAnimation],
  templateUrl: './podcasts.component.html',
  styleUrl: './podcasts.component.css',
})
export class PodcastsComponent implements OnInit {
  @ViewChild('releaseContent') releaseContent!: ElementRef<HTMLDivElement>;
  @ViewChild('trendingContent') trendingContent!: ElementRef<HTMLDivElement>;
  @ViewChild('popularContent') popularContent!: ElementRef<HTMLDivElement>;

  showLeftButtons = [false, false, false];
  showRightButtons = [false, false, false];
  timeouts: any = [null, null, null];
  contents: ElementRef<HTMLDivElement>[] = [];

  topPodcasts: Podcast[] = [];
  topicList: string[] = [];
  colors: string[] = [];

  constructor(
    private podcastService: PodcastService,
    private userService: UserService,
    private appService: AppService,
    private mediaService: MediaService
  ) {}

  ngAfterViewInit() {
    this.contents = [
      this.releaseContent,
      this.trendingContent,
      this.popularContent,
    ];
  }

  ngOnInit(): void {
    this.podcastService
      .getPopularPodcasts()
      .subscribe((podcasts) => (this.topPodcasts = podcasts));

    this.podcastService
      .getAllTopics()
      .subscribe((topics) => (this.topicList = topics));

    this.initializeColors();
  }

  private initializeColors() {
    for (let i = 0; i < 30; i++) {
      const color = this.getRandomColor();
      this.colors.push(color);
    }
  }

  private getRandomColor(): string {
    return `rgb(${this.getRandomNumber()}, ${this.getRandomNumber()}, ${this.getRandomNumber()})`;
  }

  private getRandomNumber(): number {
    return Math.floor(Math.random() * 256);
  }

  playNow(id: number) {
    const item = `${id}-podcast`;
    this.userService.addItemToUserRecentPlays(item).subscribe();
    this.userService.updateLastPlayed('audio');
    this.appService.setShowMiniPlayer(true);
    this.appService.closeMiniPlayer(false);
    this.appService.closeMaxPlayer(true);
    this.mediaService.setContentType('audio');
    this.mediaService.forward('audio');
  }

  addToQueue(id: number) {
    const item = `${id}-podcast`;
    this.userService.addItemToUserPlayQueue(item).subscribe((data) => {
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
}
