import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { Router } from '@angular/router';
import { SurveyProgressNavComponent } from './survey-progress-nav/survey-progress-nav.component';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: [
    './survey.component.scss',
    '../../assets/scss/survey-common.scss'
  ]
})
export class SurveyComponent implements OnInit {
  formFieldList:any = [];
  continueSurvey = false;

  @ViewChild('surveyProgressBar')
  surveyProgressBar!: SurveyProgressNavComponent;


  constructor(
    private datasharedservice: DataSharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formFieldList = this.datasharedservice.getObservableData1()
    if(this.formFieldList != null) {
      this.datasharedservice.saveLocalData('surveyData',JSON.stringify(this.formFieldList))
    } else if(this.datasharedservice.getLocalData("surveyData")) {
      this.formFieldList = JSON.parse(this.datasharedservice.getLocalData('surveyData'))
    }
    if( !this.formFieldList ) {
      this.router.navigate(['/pms/tender/add-new'])
    } else {
      this.startSurvey()
    }
  }

  startSurvey() {
    this.continueSurvey = true;
  }

}
