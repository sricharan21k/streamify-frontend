import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pascalcase',
  standalone: true,
})
export class PascalcasePipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.substring(1) : '';
  }
}
