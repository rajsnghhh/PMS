import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss',
    '../../../../../assets/scss/survey-offcanvas.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class ItemsComponent implements OnInit {

  AddCompanySurvey:boolean=false;
  AddCompanyWorking:boolean=false;
  AddCompanyParticipate:boolean=false;
  AddWorksAwarded:boolean=false;

  itemList:any=[
    {name:'ABCD',gps:'41 24 N 2 33 21 E',location:'Kolkata',lead:'10'}
  ]

  constructor(private navservice: NavigationService) { }

  ngOnInit(): void {
  }

  proceedNext() {
    this.navservice.changeNav('otherDetails');
  }

  deleteAlertCompany() {
    
  }

  GoBack() {
    this.navservice.changeNav('materialRates');
  }

}
