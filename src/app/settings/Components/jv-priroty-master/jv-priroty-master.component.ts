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
import { EditJvPrirotyMasterComponent } from './edit-jv-priroty-master/edit-jv-priroty-master.component';

@Component({
  selector: 'app-jv-priroty-master',
  templateUrl: './jv-priroty-master.component.html',
  styleUrls: ['./jv-priroty-master.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class JvPrirotyMasterComponent implements OnInit {

  @ViewChild('editCompany')
  editJVMaster!: EditJvPrirotyMasterComponent;

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
    this.apiservice.getJVMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.companyList = data.results;
    })
  }

  viewdownloadCompany() {
    let params = new URLSearchParams();
    params.set('page_size', '1000');
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getJVMasterList(params).subscribe(data => {
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

    this.apiservice.getJVMasterList(params).subscribe(data => {
      this.companyList = data.results;
    })
  }

  editcompanyid(id: any) {
    this.datasharedservice.saveLocalData('editJVMaster_id', JSON.stringify(id));
    this.editJVMaster.getData(id);
  }

  deleteCompany(id: number) {
    this.deleteCompanyId = id;
  }

  deleteAlertCompany() {
    this.apiservice.deleteJVMaster(this.deleteCompanyId, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.viewCompany();
    }, err => {
      if (err.status == 500) {
        this.toastrService.error(err.error.detail, '', {
          timeOut: 4000,
        });
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
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
        PAN_No: item.pan_no,
        GST_No: item.gst_no,
        Email_Id: item.email_id,
        Phone_No: item.phone_no,
        Contact_Person_name: item.contact_person_name,
        Contact_Person_phone_no: item.contact_person_phone_no,
        Contact_Person_email_id: item.contact_person_email_id,
        Available_Threshold: item.available_threshold,
        Value_of_Similar_Works: item.value_of_similar_works,
        Maximum_Span_Length_of_Bridge_Available: item.maximum_span_length_of_bridge_avail,
        Average_Annual_Turnover: item.average_annual_turn_over,
        Net_Worth: item.net_worth,
      }
      this.CompanyData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Party Name", "Party Address", "PAN No.", "GST No.", "Email Id", "Phone No.", "Contact Person Name", "Contact Person No.", "Contact Person Email", "Available Threshold (in Crs.)", "Value of Similar Works (in Crs.)", "Maximum Span Length of Bridge Available (in Mtr)", "Average Annual Turn Over (in Crs.) (last 5 years)", "Net Worth (in Crs.)"]
    };
    new ngxCsv(this.CompanyData, "JV List", options);
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
        item.pan_no,
        item.gst_no,
        item.email_id,
        item.phone_no,
        item.contact_person_name,
        item.contact_person_phone_no,
        item.contact_person_email_id,
        item.available_threshold,
        item.value_of_similar_works,
        item.maximum_span_length_of_bridge_avail,
        item.average_annual_turn_over,
        item.net_worth,
      ]
      this.CompanyData.push(obj);
    }
    var header = [["S.No", "Party Name", "Party Address", "PAN No.", "GST No.", "Email Id", "Phone No.", "Contact Person Name", "Contact Person No.", "Contact Person Email", "Available Threshold (in Crs.)", "Value of Similar Works (in Crs.)", "Maximum Span Length of Bridge Available (in Mtr)", "Average Annual Turn Over (in Crs.) (last 5 years)", "Net Worth (in Crs.)"]];
    var doc = new jsPDF('p', 'pt', 'a4');
    (doc as any).autoTable({
      head: header, body: this.CompanyData,
      startY: 10,
      startX: 0,
       styles: {
        overflow: 'linebreak',
        fontSize: 4
      }
    })
    doc.save("JV List");
    this.CompanyData = [];
  }

}
