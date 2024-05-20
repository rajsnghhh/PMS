import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-holiday-preview',
  templateUrl: './holiday-preview.component.html',
  styleUrls: ['./holiday-preview.component.scss']
})
export class HolidayPreviewComponent {

  localStorageData:any;
  holidayList:any=[];
  upCommingHolidays:any=[];
  
  constructor(
    private apiservice: HRMSAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewHoliday();
  }
  
  viewHoliday() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('country', this.localStorageData.country[0].iso2);
    params.set('state_id', this.localStorageData.state[0].state_id);
    params.set('upcoming', 'true');

    this.apiservice.getholidayList(params).subscribe(data => {
      this.holidayList=data;
      this.upCommingHolidays = this.holidayList.slice(0, 5);
    })
  }


}
