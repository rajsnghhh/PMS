import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-competition-analysis',
  templateUrl: './competition-analysis.component.html',
  styleUrls: ['./competition-analysis.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/survey-common.scss',
  '../../../../../assets/scss/survey-offcanvas.scss']
})
export class CompetitionAnalysisComponent implements OnInit {

  constructor(private navservice:NavigationService) { }

  AddCompanySurvey:boolean=false;
  AddCompanyWorking:boolean=false;
  AddCompanyParticipate:boolean=false;
  AddWorksAwarded:boolean=false;


  ngOnInit(): void {
  }

  proceedNext() {
    this.navservice.changeNav('materialRates');
  }

  GoBack() {
    this.navservice.changeNav('localData');
  }
}
