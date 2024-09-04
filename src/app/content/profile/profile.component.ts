import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Media } from '../../model/media';
import { CommonModule } from '@angular/common';
import { fadeInOutAnimation } from '../../animations/fade-animations';
import { UserProfile } from '../../model/UserProfile';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [fadeInOutAnimation],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @ViewChild('historyContent') historyContent!: ElementRef<HTMLDivElement>;
  @ViewChild('watchlistContent') watchlistContent!: ElementRef<HTMLDivElement>;
  @ViewChild('recentContent') recentContent!: ElementRef<HTMLDivElement>;
  @ViewChild('queueContent') queueContent!: ElementRef<HTMLDivElement>;

  @ViewChildren('historyTextElements') historyTextElements!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('watchlistTextElements') watchlistTextElements!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('recentsTextElements') recentsTextElements!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('queueTextElements') queueTextElements!: QueryList<
    ElementRef<HTMLDivElement>
  >;

  userProfile?: UserProfile;
  imageData: FormData;
  profileImage: any;
  timeout: any;

  showLeftButtons = [false, false, false, false];
  showRightButtons = [false, false, false, false];
  timeouts: any = [null, null, null, null];
  contents: ElementRef<HTMLDivElement>[] = [];

  historyItems: Media[] = [];
  watchlistItems: Media[] = [];
  recentItems: Media[] = [];
  playQueueItems: Media[] = [];
  overflowStates: boolean[] = [];

  overflow: { list: string; index: number } = { list: '', index: -1 };

  constructor(
    private userService: UserService,
    private mediaService: MediaService,
    private router: Router
  ) {
    this.imageData = new FormData();
  }

  ngAfterViewInit() {
    this.contents = [
      this.historyContent,
      this.watchlistContent,
      this.recentContent,
      this.queueContent,
    ];
  }

  ngOnInit(): void {
    this.profileImage = this.getImage();
    this.userService
      .getUserProfile()
      .subscribe((data) => (this.userProfile = data));

    this.userService
      .getUserWatchHistory()
      .subscribe((data) => (this.historyItems = data));

    this.userService
      .getUserWatchlist()
      .subscribe((data) => (this.watchlistItems = data));

    this.userService
      .getUserRecentPlays()
      .subscribe((data) => (this.recentItems = data));

    this.userService
      .getUserPlayQueue()
      .subscribe((data) => (this.playQueueItems = data));
  }

  uploadImage(event: any) {
    const image: File = event.target.files[0];
    const imageData = new FormData();
    imageData.append('profileImage', image, image.name);
    this.userService.uploadProfile(imageData).subscribe((data) => {
      this.profileImage = '';
      this.timeout = setTimeout(() => {
        this.profileImage = this.getImage();
      }, 2000);
    });
  }

  getImage() {
    console.log('image', this.userService.getProfileImage());
    return this.userService.getProfileImage();
  }

  playNow() {}

  watchNow() {}

  removeItemFromList(item: Media, listType: string) {
    const stringifiedItem = `${item.id}-${item.type}`;
    switch (listType) {
      case 'history': {
        this.userService
          .deleteItemFromUserWatchHistory(stringifiedItem)
          .subscribe((data) => (this.historyItems = data));
        break;
      }
      case 'watchlist': {
        this.userService
          .deleteItemFromUserWatchlist(stringifiedItem)
          .subscribe((data) => {
            this.watchlistItems = data;
            this.mediaService.setMedia('video', data[0]);
          });
        break;
      }
      case 'recents': {
        this.userService
          .deleteItemFromUserRecentPlays(stringifiedItem)
          .subscribe((data) => (this.recentItems = data));
        break;
      }
      case 'queue': {
        this.userService
          .deleteItemFromUserPlayQueue(stringifiedItem)
          .subscribe((data) => {
            this.playQueueItems = data;
            this.mediaService.setMedia('audio', data[0]);
          });
        break;
      }
    }
  }

  checkOverflow(listType: string, index: number) {
    let el;
    switch (listType) {
      case 'history':
        el = this.historyTextElements.toArray()[index].nativeElement;
        break;
      case 'watchlist':
        el = this.watchlistTextElements.toArray()[index].nativeElement;
        break;
      case 'recents':
        el = this.recentsTextElements.toArray()[index].nativeElement;
        break;
      case 'queue':
        el = this.queueTextElements.toArray()[index].nativeElement;
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

  changePassword() {
    localStorage.clear();
    this.router.navigate(['/recover']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
