import { Component, OnInit } from '@angular/core';
import { ShowService } from '../../../services/show.service';
import { Show } from '../../../model/video/show';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PascalcasePipe } from '../../../pipes/pascalcase.pipe';
import { Episode } from '../../../model/video/episode';
import { MediaService } from '../../../services/media.service';
import { AppService } from '../../../services/app.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-show-details',
  standalone: true,
  imports: [CommonModule, PascalcasePipe, RouterLink],
  templateUrl: './show-details.component.html',
  styleUrl: './show-details.component.css',
})
export class ShowDetailsComponent implements OnInit {
  selectedShow?: Show;
  episodeList: Episode[] = [];
  shows: Show[] = [];

  showId: string | null = null;
  genre: string | null = null;
  topic: string | null = null;
  header: string = '';

  constructor(
    private showService: ShowService,
    private userService: UserService,
    private appService: AppService,
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.route.paramMap.subscribe((param) => {
    //   const showId = +(param.get('showId') as string);
    //   this.showService.getShow(showId).subscribe((show) => {
    //     this.selectedShow = show;
    //     this.selectedShow.episodeList.forEach((episodeId) => {
    //       this.showService.getEpisode(episodeId).subscribe((episode) => {
    //         this.episodeList.push(episode);
    //       });
    //     });
    //   });
    // });

    this.route.paramMap.subscribe((param) => {
      this.showId = param.get('showId');
      this.genre = param.get('genre');
      this.topic = param.get('topic');

      this.handleParams();
    });
  }

  private handleParams() {
    if (this.showId) {
      this.showService.getShow(+this.showId).subscribe((show) => {
        this.selectedShow = show;
        this.selectedShow.episodeList.forEach((episodeId) => {
          this.showService.getEpisode(episodeId).subscribe((episode) => {
            this.episodeList.push(episode);
          });
        });
      });
    }

    if (this.genre) {
      this.showService.getShowsOfGenre(this.genre).subscribe((shows) => {
        this.shows = shows;
        this.header = this.genre as string;
      });
    }

    if (this.topic) {
      this.header = this.topic.split('-').join(' ');
      switch (this.topic) {
        case 'new-releases': {
          this.showService
            .getNewReleases()
            .subscribe((shows) => (this.shows = shows));
          break;
        }
        case 'popular': {
          this.showService
            .getNewReleases()
            .subscribe((shows) => (this.shows = shows));
          break;
        }
        default:
      }
    }
  }

  watchNow(id: number) {
    const item = `${id}-show`;
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
    const item = `${id}-show`;
    this.userService.addItemToUserWatchlist(item).subscribe((data) => {
      // this.mediaService.setMedia(data);
    });
  }
}
