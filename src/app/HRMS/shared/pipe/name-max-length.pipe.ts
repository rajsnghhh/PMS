import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameMax'
})
export class NameMaxPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value == '') {
      return '';
    }
    let result = '';
    if (value.length > 14) {
      let res = value.slice(0, 14);
      result = res + '...';
    } else {
      result = value;
    }
    return result;
  }

}
