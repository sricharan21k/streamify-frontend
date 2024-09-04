import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideDownAnimation = trigger('slideDown', [
  state('void', style({})),
  transition(':leave', [animate('0.3s')]),
]);
