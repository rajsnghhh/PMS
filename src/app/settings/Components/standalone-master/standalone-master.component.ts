import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { EditStandaloneMasterComponent } from './edit-standalone-master/edit-standalone-master.component';

@Component({
  selector: 'app-standalone-master',
  templateUrl: './standalone-master.component.html',
  styleUrls: ['./standalone-master.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class StandaloneMasterComponent implements OnInit {

  @ViewChild('editCompany')
  editStandaloneMaster!: EditStandaloneMasterComponent;

  companyForm!: FormGroup;
  countrylist: any;
  deleteCompanyId: any;
  companyList: any = [];
  localStorageData: any;
  Companycsvdownload: any;
  CompanyData: any = [];
  userPermissions: any = {}

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  CompanyList: any;

  constructor(
    private apiservice: APIService,
    private router: Router,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService

  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewCompany();
    this.viewdownloadCompany();
    this.getUserPermission();
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }

  viewCompany() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getStandaloneMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.companyList = data.results;
    })
  }

  viewdownloadCompany() {
    let params = new URLSearchParams();
    params.set('page_size', '1000');
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getStandaloneMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.CompanyList = data.results;
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

    this.apiservice.getStandaloneMasterList(params).subscribe(data => {
      this.companyList = data.results;
    })
  }

  editcompanyid(id: any) {
    this.datasharedservice.saveLocalData('standaloneMaster_id', JSON.stringify(id));
    this.editStandaloneMaster.getData(id);
  }

  deleteCompany(id: number) {
    this.deleteCompanyId = id;
  }

  deleteAlertCompany() {
    this.apiservice.deleteStandaloneMaster(this.deleteCompanyId, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.viewCompany();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  downloadCsv() {
    var i = 0;
    for (const item of this.CompanyList) {
      i = i + 1;
      var obj = {
        S_No: i,
        PartyName: item.party_name,
        PartyAddress: item.party_address,
        LeadName: item.lead_member_name,
        PAN_No: item.pan_no,
        GST_No: item.gst_no,
        Email_Id: item.email_id,
        Phone: item.phone_no,
      }
      this.CompanyData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Party Name", "Party Address", "Lead Member Name", "PAN No.", "GST No.", "Email Id", "Phone No."]
    };
    new ngxCsv(this.CompanyData, "Stand Alone List", options);
    window.location.reload();
  }

  downloadPdf() {
    var i = 0;
    for (const item of this.CompanyList) {
      i = i + 1;
      var obj = [
        i,
        item.party_name,
        item.party_address,
        item.lead_member_name,
        item.pan_no,
        item.gst_no,
        item.email_id,
        item.phone_no,
      ]
      this.CompanyData.push(obj);
    }
    var header = [["S.No.", "Party Name", "Party Address", "Lead Member Name", "PAN No.", "GST No.", "Email Id", "Phone No."]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.CompanyData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    doc.save("Stand Alone List");
    this.CompanyData = [];
  }

}
