import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-name-of-work',
  templateUrl: './name-of-work.component.html',
  styleUrls: [
    './name-of-work.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss',
    '../../../../../assets/scss/survey-offcanvas.scss'
  ]
})
export class NameOfWorkComponent implements OnInit {

  constructor(
    private navservice:NavigationService
  ) { }

  ngOnInit(): void {
  }
  proceedNext() {
    this.navservice.changeNav('documentCollection');
  }

  GoBack() {
    this.navservice.changeNav('hydrologicalData');
  }
}
