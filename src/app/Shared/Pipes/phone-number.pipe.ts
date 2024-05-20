import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value == '') {
      return '';
    }
    let res = value.match(/.{1,5}/g) + '';
    let result = res.replace(/,/g, " ");
    return result;
  }

}
