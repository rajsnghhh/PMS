import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../Services/common-function.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private commonFunction: CommonFunctionService
  ) { }

  ngOnInit(): void {
  }

  openSFT() {
    this.commonFunction.takeToSFT()
  }

}
