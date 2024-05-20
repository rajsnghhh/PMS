import { Component, OnInit } from '@angular/core';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-leave-preview',
  templateUrl: './leave-preview.component.html',
  styleUrls: ['./leave-preview.component.scss']
})
export class LeavePreviewComponent implements OnInit {

  userData:any;
  leaveData:any;
  activeSession:any;
  constructor(
    private apiservice: HRMSAPIService,
    private datasharedservice: DataSharedService
  ) {

  }

  ngOnInit(): void {
    this.activeSession = JSON.parse(this.datasharedservice.getLocalData('activeSession'));
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getLeaveSummery();

  }

  getLeaveSummery() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('year', this.activeSession.SprintYear);
    this.apiservice.getLeaveSummery(params).subscribe(data => {
      this.leaveData = data.result;
    })
  }
}
