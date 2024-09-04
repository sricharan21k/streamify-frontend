import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { CommonModule } from '@angular/common';
import { slideDownAnimation } from './animations/slide-animation';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AppService } from './services/app.service';
import { MediaPlayerComponent } from './components/media-player/media-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MainComponent,
    MediaPlayerComponent,
  ],
  animations: [slideDownAnimation],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = '';
  hideMiniPlayer = false;
  hideMaxPlayer = true;
  showAppComponents = false;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showAppComponents = ![
          '/',
          '/login',
          '/register',
          '/recover',
        ].includes(event.url);
      }
    });

    this.appService.$hideMaxPlayer.subscribe((value) => {
      this.hideMaxPlayer = value;
    });
    this.appService.$hideMiniPlayer.subscribe(
      (value) => (this.hideMiniPlayer = value)
    );
  }
}
