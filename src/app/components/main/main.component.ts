import { CommonModule, Location } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Route,
  Router,
  RouterOutlet,
} from '@angular/router';
import { AppService } from '../../services/app.service';
import { slideDownAnimation } from '../../animations/slide-animation';
import { PascalcasePipe } from '../../pipes/pascalcase.pipe';
import { Media } from '../../model/media';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { MediaService } from '../../services/media.service';
import { UserService } from '../../services/user.service';
import {
  routeAnimationFade,
  routeTransition,
} from '../../animations/route-animations';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PascalcasePipe, ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  animations: [routeTransition],
})
export class MainComponent implements OnInit {
  // @HostBinding('routeAnimationTrigger') routeAnimation = true;

  currentTopic: string = this.appService.getCurrentTopic();
  showHeader: boolean = true;
  showBackButton: boolean = false;
  searchResults: Media[] = [];
  searchControl = new FormControl('');
  searchForm: FormGroup;
  searchHistory: Media[] = [];

  constructor(
    private appService: AppService,
    private mediaService: MediaService,
    private userService: UserService,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    public route: ActivatedRoute
  ) {
    this.searchForm = fb.group({
      searchControl: this.searchControl,
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !['/', '/login', '/register', '/recover'].includes(
          event.url
        );
        this.showBackButton = ![
          '/home',
          '/movies',
          '/shows',
          '/music',
          '/podcasts',
          '/games',
          '/profile',
        ].includes(event.url);
      }
    });

    this.appService.$currentTopic.subscribe(
      (topic) => (this.currentTopic = topic)
    );

    if (this.userService.getUsername()) {
      this.userService
        .getUserSearchHistory()
        .subscribe((data) => (this.searchHistory = data));
    }
  }

  filter() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) =>
          this.appService.searchLibrary(
            query ? (query.length > 1 ? query : 'undefined') : 'undefined'
          )
        )
      )
      .subscribe((results) => (this.searchResults = results));
  }

  viewDetails(media: Media) {
    const searchItem = `${media.id}-${media.type}`;
    this.userService
      .addItemToUserSearchHistory(searchItem)
      .subscribe((data) => (this.searchHistory = data));

    switch (media.type) {
      case 'artist':
        this.router.navigateByUrl(`/music/artist/${media.id}/albums`);
        break;
      case 'album':
        this.router.navigate(['/music/album', media.id]);
        break;
      case 'movie':
        this.router.navigate(['movie', media.id]);
        break;
      case 'show':
        this.router.navigate(['/show', media.id]);
        break;
      case 'song':
        this.mediaService.forward('audio');
        break;
      case 'podcast':
      // this.mediaService.playPause();
    }
  }

  deleteSearch(item: Media) {
    const stringifiedItem = `${item.id}-${item.type}`;
    this.userService
      .deleteItemFromUserSearchHistory(stringifiedItem)
      .subscribe((data) => (this.searchHistory = data));
  }

  navigateBack() {
    this.location.back();
  }
}
