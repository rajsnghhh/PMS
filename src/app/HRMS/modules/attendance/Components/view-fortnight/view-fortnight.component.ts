import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-view-fortnight',
  templateUrl: './view-fortnight.component.html',
  styleUrls: ['./view-fortnight.component.scss',
    '../../../../../../assets/scss/from-coomon.scss'
  ]
})
export class ViewFortnightComponent implements OnInit {

  fortnightData: any = [];
  monthList: any = [];
  localStorageData: any;
  progress: number = 0;
  activeSession: any;
  firstfortnightData: any = {};
  secondfortnightData: any = {};
  firstftstartdate:any;
  firstftenddate: any;
  completionpercentage:any;
  totaltimecompleted:any;

  constructor(
    private apiservice: HRMSAPIService,
    private router: Router,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.activeSession = JSON.parse(this.datasharedservice.getLocalData('activeSession'));
    this.getFortnightData();
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

  getData(data:any) {
    this.activeSession.SprintData = data;
    this.activeSession.SprintYear = data.start_month_year;
    this.getFortnightData()
  }

}
