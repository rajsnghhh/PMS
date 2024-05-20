import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormTypeIMG'
})
export class FormFieldIMGPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let res = '';
    if (value == 'dropdown') {
      res = 'assets/icons/dropdown.png'
    } else if (value == 'text') {
      res = 'assets/icons/txtfld.png'
    } else if (value == 'checkbox') {
      res = 'assets/icons/checkbox.png'
    } else if (value == 'date') {
      res = 'assets/icons/date_dt.png'
    } else if (value == 'multiselect') {
      res = 'assets/icons/multi-select.png'
    } else if (value == 'radio') {
      res = 'assets/icons/radio-list-line.png'
    } else if (value == 'lookup') {
      res = 'assets/icons/look-up.png'
    } else if (value == 'boolean') {
      res = 'assets/icons/boolean.png'
    } else if (value == 'file') {
      res = 'assets/icons/documents.png'
    } else if (value == 'formulla') {
      res = 'assets/icons/formulla.png'
    }else if (value == 'reference') {
      res = 'assets/icons/reference.png'
    }else if (value == 'dependency') {
      res = 'assets/icons/dependency.png'
    }else if (value == 'phone') {
      res = 'assets/icons/phone.png'
    }else if (value == 'number') {
      res = 'assets/icons/number.jpg'
    }else if (value == 'phone') {
      res = 'assets/icons/phone.png'
    }
    else {
      res = 'assets/icons/txtera.png'
    }


    return res;
  }

}
