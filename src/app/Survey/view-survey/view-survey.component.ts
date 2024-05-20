import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss',
    '../../../assets/scss/scrollableTable.scss'
  ]
})
export class ViewSurveyComponent implements OnInit {

  tenderData: any;
  surveyList: any = [];
  tenderId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService
  ) { }

  ngOnInit(): void {
    this.tenderData = JSON.parse(this.datasharedservice.getLocalData('tender_id'));
    this.viewSurveyList();
  }

  viewSurveyList() {
    let query = this.commonFunction.getURL(
      {
        id: this.tenderData
      }
    )
    this.apiservice.getSurveyList(query).subscribe(data => {
      this.surveyList = data;
    })
  }

}
