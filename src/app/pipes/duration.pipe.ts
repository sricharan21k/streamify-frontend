import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    return `${Math.trunc(value / 60)} hr ${value % 60} min`;
  }
}
