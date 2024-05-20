import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: [
    './location-details.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss'
  ]
})
export class LocationDetailsComponent implements OnInit {

  constructor(
    private navservice:NavigationService
  ) { }

  ngOnInit(): void {
  }

  proceedNext() {
    this.navservice.changeNav('generalDetails');
  }

  GoBack() {
    this.navservice.changeNav('basicDetails');
  }

}
