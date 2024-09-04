import {
  trigger,
  transition,
  style,
  animate,
  query,
} from '@angular/animations';
import { scan } from 'rxjs';

export const routeAnimationFade = trigger('routeAnimationTrigger', [
  transition(':enter', [
    style({
      opacity: 0,
    }),
    animate(300),
  ]),
  transition(':leave', [
    animate(
      300,
      style({
        opacity: 0,
      })
    ),
  ]),
]);

export const routeTransition = trigger('routeTransition', [
  transition('* => *', [
    query(':enter', [style({ opacity: 0, scale: 0.9 })], { optional: true }),
    query(':leave', animate(150, style({ opacity: 0, scale: 0.9 })), {
      optional: true,
    }),
    query(':enter', animate(150, style({ opacity: 1, scale: 1 })), {
      optional: true,
    }),
  ]),
]);
