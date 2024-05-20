import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: [
    './other-details.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss'
  ]
})
export class OtherDetailsComponent implements OnInit {

  constructor(private navservice: NavigationService) { }

  ngOnInit(): void {
  }

  GoBack() {
    this.navservice.changeNav('items');
  }

}
