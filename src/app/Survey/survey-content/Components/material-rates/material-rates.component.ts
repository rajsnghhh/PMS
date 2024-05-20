import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-material-rates',
  templateUrl: './material-rates.component.html',
  styleUrls: ['./material-rates.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/survey-common.scss',
  '../../../../../assets/scss/survey-offcanvas.scss',
  '../../../../../assets/scss/scrollableTable.scss'
]
})
export class MaterialRatesComponent implements OnInit {

  constructor(private navservice:NavigationService) { }
  AddCompanySurvey:boolean=true;
  ngOnInit(): void {
  }
  proceedNext() {
    this.navservice.changeNav('items');
  }

  GoBack() {
    this.navservice.changeNav('competitionAnalysis');
  }
}
