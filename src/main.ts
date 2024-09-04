import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Buffer } from 'buffer';

(window as any).global = window;
(window as any).Buffer = Buffer;

// platformBrowserDynamic()
//   .bootstrapModule(AppComponent)
//   .catch((err) => console.error(err));

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
