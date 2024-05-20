import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { EditDelayReasonComponent } from './edit-delay-reason/edit-delay-reason.component';

@Component({
  selector: 'app-delay-reason',
  templateUrl: './delay-reason.component.html',
  styleUrls: ['./delay-reason.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class DelayReasonComponent implements OnInit {
  @ViewChild('editDepartment')
  editDepartment!: EditDelayReasonComponent;

  localStorageData: any;
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  delayreasonList: any = [];
  DelayreasonData: any = [];
  deleteDelayreasonId: any;


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService

  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewDelayreasonlist();
  }

  viewDelayreasonlist() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getDelayreason(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.delayreasonList = data.results;
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
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)

    this.apiservice.getDelayreason(params).subscribe(data => {
      this.delayreasonList = data.results;
    })

  }


  editdepartmentid(id: any) {
    this.datasharedservice.saveLocalData('delayreason_id', JSON.stringify(id));
    this.editDepartment.getData(id);
  }

  deleteDepartment(id: number) {
    this.deleteDelayreasonId = id;
  }

  deleteAlertDepartment() {
    this.apiservice.deleteDelayreason(this.deleteDelayreasonId, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.viewDelayreasonlist();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  downloadCsv() {
    var i = 0;
    for (const item of this.delayreasonList) {
      i = i + 1;
      var obj = {
        S_No: i,
        delaycode: item.delay_code,
        delayreason: item.reasons,
        risktype: item.risk_type,  
        RiskColorCode: item.color_code
      }
      this.DelayreasonData.push(obj);
    }

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Delay Code", "Delay Reason", "Risk Type", "Risk Color Code"]
    };
    new ngxCsv(this.DelayreasonData, "DelayreasonList", options);
    window.location.reload();
  }

  downloadPdf() {
    var i = 0;
    for (const item of this.delayreasonList) {
      i = i + 1;
      var obj = [
        i,
        item.delay_code,
        item.reasons,
        item.risk_type,
        item.color_code    
      ]
      this.DelayreasonData.push(obj);
    }
    var header = [["S.No.", "Delay Code", "Delay Reason", "Risk Type", "Risk Color Code"]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.DelayreasonData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    doc.save("Delay Reason List");
    this.DelayreasonData = [];

  }

}
