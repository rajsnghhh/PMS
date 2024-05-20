import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textMax'
})
export class TextMaxPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value == '') {
      return '';
    }
    let result = '';
    if (value.length > 20) {
      let res = value.slice(0, 20);
      result = '<div class="dropdown"> <span class="dropbtn">'+res + '...'+'</span> <div class="dropdown-content"> <div class="img-container dropdown_container"> <span><label>'+value+'</label></span> </div> </div> </div>';
    } else {
      result = value;
    }
    return result;
  }

}
