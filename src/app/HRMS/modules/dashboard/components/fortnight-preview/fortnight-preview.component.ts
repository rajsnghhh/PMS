import { Component, OnInit } from '@angular/core';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-fortnight-preview',
  templateUrl: './fortnight-preview.component.html',
  styleUrls: ['./fortnight-preview.component.scss']
})
export class FortnightPreviewComponent implements OnInit {

  constructor(
    private apiservice: HRMSAPIService,
    private datasharedservice: DataSharedService
  ) { }

  localStorageData: any;
  activeSession: any;
  firstfortnightData: any = {};
  secondfortnightData: any = {};

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.activeSession = JSON.parse(this.datasharedservice.getLocalData('activeSession'));
    this.getFortnightData()
  }

  getFortnightData() {
    if (this.activeSession.HRMSData.fortnite_type == 'single') {
      this.getFortnightprogress(this.activeSession.SprintData.fortnight_start_date, this.activeSession.SprintData.fortnight_end_date);
    }else{
      this.getFortnightprogress(this.activeSession.SprintData.fortnight_start_date, this.activeSession.SprintData.second_fortnight_end);
    }
  }

  getFortnightprogress(startDate: any, endDate: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('start_date', startDate);
    params.set('end_date', endDate);
    params.set('year', this.activeSession.SprintYear);
    this.apiservice.getfortnitProgress(params).subscribe(data => {
      this.firstfortnightData = data.result[0]
    })
  }
}
