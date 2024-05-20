import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-general-details',
  templateUrl: './general-details.component.html',
  styleUrls: [
    './general-details.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss'
  ]
})
export class GeneralDetailsComponent implements OnInit {

  constructor(
    private navservice:NavigationService
  ) { }

  ngOnInit(): void {
  }

  proceedNext() {
    this.navservice.changeNav('hydrologicalData');
  }

  GoBack() {
    this.navservice.changeNav('locationDetails');
  }

}
