import { Component } from '@angular/core';
import { CommonFunctionService } from '../../Services/common-function.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent {

  constructor(
    private commonFunction: CommonFunctionService
  ) { }

  openSFT() {
    this.commonFunction.takeToSFT()
  }
}
