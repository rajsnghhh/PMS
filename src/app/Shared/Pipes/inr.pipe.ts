import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inr'
})
export class InrPipe implements PipeTransform {
  options = { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  };
  transform(value: unknown, ...args: unknown[]): unknown {
    return  'INR '+Number(value).toLocaleString('en', this.options);
  }

}
