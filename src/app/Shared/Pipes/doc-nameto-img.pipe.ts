import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'docNametoIMG'
})
export class DocNametoIMGPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let res = '';
    let type = value.split('.').pop();
    if (type == 'doc' || type == 'DOC' || type == 'docx') {
      res = '<span class="file-type"><img src="assets/icons/doc.png " alt=""></span>'
    } else if (type == 'pdf' || type == 'PDF') {
      res = '<span class="file-type"><img src="assets/icons/pdf.png " alt=""></span>'
    } else {
      res = '<span class="file-type"><img src="assets/icons/image.png " alt=""></span>'
    }


    return res;
  }

}
