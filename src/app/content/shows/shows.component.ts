import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ShowService } from '../../services/show.service';
import { ShowGenre } from '../../model/video/show-genre';
import { CommonModule } from '@angular/common';
import { PascalcasePipe } from '../../pipes/pascalcase.pipe';
import { RouterLink } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { AppService } from '../../services/app.service';
import { UserService } from '../../services/user.service';
import { fadeInOutAnimation } from '../../animations/fade-animations';

@Component({
  selector: 'app-shows',
  standalone: true,
  templateUrl: './shows.component.html',
  styleUrl: './shows.component.css',
  imports: [CommonModule, PascalcasePipe, RouterLink],
  animations: [fadeInOutAnimation],
})
export class ShowsComponent implements OnInit {
  @ViewChildren('content') contents!: QueryList<ElementRef<HTMLDivElement>>;

  showLeftButtons: boolean[] = [];
  showRightButtons: boolean[] = [];
  timeouts: any[] = [];
  genres: ShowGenre = {};
  constructor(
    private showService: ShowService,
    private userService: UserService,
    private appService: AppService,
    private mediaService: MediaService
  ) {}

  ngAfterViewInit() {
    this.contents.forEach((content, index) => {
      this.showLeftButtons[index] = false;
      this.showRightButtons[index] = false;
      this.timeouts[index] = null;
    });
  }

  ngOnInit(): void {
    this.showService.getGenres().subscribe((genres) => (this.genres = genres));
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
