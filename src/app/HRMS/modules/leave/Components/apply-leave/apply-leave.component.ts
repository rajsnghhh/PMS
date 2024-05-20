import { Component, OnInit } from '@angular/core';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss']
})
export class ApplyLeaveComponent implements OnInit{

  userData:any;
  leaveData:any;
  activeSession:any; 
  
  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: HRMSAPIService
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
