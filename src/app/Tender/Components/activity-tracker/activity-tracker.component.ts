import { Component } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';


@Component({
  selector: 'app-activity-tracker',
  templateUrl: './activity-tracker.component.html',
  styleUrls: ['./activity-tracker.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class ActivityTrackerComponent {
  ActivityList:any = [];
  userId: any;
  tenderId: any;

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;

  queryParaMap: any = {
    page_size: 10,
    page: 1,
  }

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService

  ) { }

  ngOnInit(): void {
    this.tenderId = JSON.parse(this.datasharedservice.getLocalData('tender_id'));
    this.getData();
  }

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    this.queryParaMap.page_size = this.paginationValue.pagesizeValue;
    this.queryParaMap.page = this.paginationValue.pagevalue;
    this.getData();
  }

  getData() {
    this.queryParaMap.tender_id = this.tenderId;
    this.queryParaMap.activity_type = 'milestone';
    let query = this.commonFunction.getURL(this.queryParaMap)
    this.apiservice.getActivityTracker(query).subscribe(data => {
      this.ActivityList = data.results;
      this.paginationservice.setTotalItemData(data.count);
    })
  }
}
