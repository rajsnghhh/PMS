import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { HRMSAPIService } from '../shared/HRMS-Services/hrmsApi.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'hrms-main',
  templateUrl: './hrms-main.component.html',
  styleUrls: ['./hrms-main.component.scss']
})
export class HrmsMainComponent implements OnInit{
  
  localStorageData:any
  loadRouterOutlate:boolean = false;
  constructor(
    private titleService:Title,
    private dataShareService:DataSharedService,
    private apiservice: HRMSAPIService,
    private commonFunction: CommonFunctionService
  ) {
    this.titleService.setTitle("HRMS");
  }

  ngOnInit(): void {
    this.dataShareService.saveLocalData('activeProduct','hrms');
    this.localStorageData = JSON.parse(this.dataShareService.getLocalData('userDATA'));
    this.getHRMSDetails()
  }

  getHRMSDetails() {
    this.apiservice.getHRMSDetails(this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.monthsList(this.commonFunction.getFinancialYear(data.result[0]),data.result[0])
    })
  }

  monthsList(finaceData:any,Data:any) {
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('year', finaceData.split('||')[0].toString());
    this.apiservice.getmonthList(params).subscribe(data => {
      for(let i=0; i<data.result.length; i++) {
        if(data.result[i].current_fortnight) {
          let currentSprint = {
            'HRMSData': Data,
            'SprintYear':finaceData.split('||')[0],
            'FinancialStart':finaceData.split('||')[1],
            'FinancialEnd':finaceData.split('||')[2],
            'SprintData': '',
            'SprintDataIndex': i
          }
          currentSprint.SprintData = data.result[i]
          this.dataShareService.removeLocalData('activeSession');
          this.dataShareService.saveLocalData('activeSession',JSON.stringify(currentSprint))
          this.loadRouterOutlate = true
          break;
        }
      }
    })    
  }

  openSFT() {
    this.commonFunction.takeToSFT()
  }

}
