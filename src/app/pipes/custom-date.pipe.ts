import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common'; 

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {} 

  transform(value: Date | string | undefined, format: string = 'dd/MM/yyyy'): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Hoy';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Mañana';
    } else {
      return this.datePipe.transform(value, format);
    }
  }
}