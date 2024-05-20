import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-hydrological-data',
  templateUrl: './hydrological-data.component.html',
  styleUrls: [
    './hydrological-data.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss'
  ]
})
export class HydrologicalDataComponent implements OnInit {

  constructor(
    private navservice:NavigationService
  ) { }

  ngOnInit(): void {
  }

  proceedNext() {
    this.navservice.changeNav('nameofWork');
  }

  GoBack() {
    this.navservice.changeNav('generalDetails');
  }

}
