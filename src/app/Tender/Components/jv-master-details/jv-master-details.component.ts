import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'app-jv-master-details',
  templateUrl: './jv-master-details.component.html',
  styleUrls: ['./jv-master-details.component.scss']
})
export class JvMasterDetailsComponent {

  varValue:any=true;

  localStorageData: any;
  TenderList: any = [];
  TenderName: any = [];
  TenderJVList: any = [];
  jvList: any = [];

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  TenderType: any;
  TenderFilterName: any;
  TenderId: any;

  constructor(
    private paginationservice: PaginationService,
    private router: Router,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.TenderType = JSON.parse(this.datasharedservice.getLocalData('EvaluationJVTender'));
    this.queryParaMap.tender_status = 'all';
    this.TenderId = JSON.parse(this.datasharedservice.getLocalData('JVTenderId'));
    // this.getTenderJVList();
    this.viewJVinfo();
  }

  
  queryParaMap: any = {
    page_size: 10,
    page: 1,
    organisation: ''
  }

  getTenderJVList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_type', this.TenderType);
    params.set('tender_status', this.queryParaMap.tender_status);
    params.set('page_size', this.pageSize);
    params.set('page', this.page);
    params.set('list', 'true');
    params.set('jv_id', this.TenderId);
    this.apiservice.getTenderList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.TenderJVList = data.results;
      this.TenderName = data;
    })
    this.TenderFilterName = this.queryParaMap.tender_status.replace(/_/g, " ");
  }

  viewJVinfo() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_type', this.TenderType);
    params.set('jv_id', this.TenderId);
    this.apiservice.getJVMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      for(let i=0;i<data.results.length;i++){
        if(data.results[i].id == this.TenderId){
          this.jvList=data.results[i];
        }
      }
    })
  }

}
