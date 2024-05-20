import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: [
    './basic-details.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss'
  ]
})
export class BasicDetailsComponent implements OnInit {

  constructor(
    private navservice:NavigationService
  ) { }

  ngOnInit(): void {
  }

  proceedNext() {
    this.navservice.changeNav('locationDetails');
  }
  
}
