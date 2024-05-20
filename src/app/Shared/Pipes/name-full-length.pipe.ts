import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFullLength'
})
export class NameFullLengthPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value == '') {
      return '';
    }
    let result = '';
    if (value.length > 40) {
      let res = value.slice(0, 40);
      result = res + '...';
    } else {
      result = value;
    }
    return result;
  }

}
