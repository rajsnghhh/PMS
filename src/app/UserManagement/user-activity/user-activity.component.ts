import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss',
      '../../../assets/scss/scrollableTable.scss'
]
})
export class UserActivityComponent implements OnInit {

  ActivityList:any;
  userId:any;

  pageSize:any=10;
  page:any=1;
  paginationValue:any;

  queryParaMap: any = {
    page_size: 10,
    page: 1,
    user_id:''
  }

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService

    ) { }

  ngOnInit(): void {
    this.userId = JSON.parse(this.datasharedservice.getLocalData('ActivityUserId'));
    this.getActivityList();
  }

  getActivityList(){
    this.queryParaMap.user_id = this.userId;
    let query = this.commonFunction.getURL(this.queryParaMap)
    this.apiservice.userActivityList(query).subscribe(data => {
      this.ActivityList=data.results;
      this.paginationservice.setTotalItemData(data.count);
    })
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
    this.getActivityList();
  }

}
