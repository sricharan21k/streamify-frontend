import { Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private appService: AppService) {}

  setCurrentTopic(topic: string) {
    this.appService.setCurrentTopic(topic);
  }
}
