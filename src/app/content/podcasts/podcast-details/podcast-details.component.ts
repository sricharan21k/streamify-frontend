import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PascalcasePipe } from '../../../pipes/pascalcase.pipe';
import { PodcastService } from '../../../services/podcast.service';
import { Podcast } from '../../../model/audio/podcast';
import { AppService } from '../../../services/app.service';
import { MediaService } from '../../../services/media.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-podcast-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PascalcasePipe],
  templateUrl: './podcast-details.component.html',
  styleUrl: './podcast-details.component.css',
})
export class PodcastDetailsComponent implements OnInit {
  header = '';
  category: string | null = null;
  topic: string | null = null;

  podcastList: Podcast[] = [];

  constructor(
    private podcastService: PodcastService,
    private userService: UserService,
    private appService: AppService,
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.category = param.get('category');
      this.topic = param.get('topic');
      this.handleParams();
    });
  }

  private handleParams() {
    if (this.topic) {
      this.header = this.topic;
      this.podcastService
        .getPodcastsOfTopic(this.topic)
        .subscribe((podcasts) => (this.podcastList = podcasts));
    }

    if (this.category) {
      this.header = this.category.split('-').join(' ');
      switch (this.category) {
        case 'new-releases': {
          this.podcastService
            .getNewPodcasts()
            .subscribe((podcasts) => (this.podcastList = podcasts));
          break;
        }
        case 'trending': {
          this.podcastService
            .getTrendingPodcasts()
            .subscribe((podcasts) => (this.podcastList = podcasts));
          break;
        }
        case 'popular': {
          this.podcastService
            .getPopularPodcasts()
            .subscribe((podcasts) => (this.podcastList = podcasts));
          break;
        }
      }
    }
  }

  playNow(id: number) {
    const item = `${id}-podcast`;
    this.userService.addItemToUserRecentPlays(item);
    this.userService.updateLastPlayed('audio');
    this.appService.setShowMiniPlayer(true);
    this.appService.closeMiniPlayer(false);
    this.appService.closeMaxPlayer(true);
    this.mediaService.setContentType('audio');
    this.mediaService.forward('audio');
  }

  addToQueue(id: number) {
    const item = `${id}-podcast`;
    this.userService.addItemToUserRecentPlays(item).subscribe((data) => {
      // this.mediaService.setMedia(data);
    });
  }
}
