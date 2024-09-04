import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  state('void', style({ opacity: 0 })),
  transition(':enter', [animate('0.5s ease-in')]),
]);

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
]);
