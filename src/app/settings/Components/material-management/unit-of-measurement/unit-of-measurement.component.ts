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
import { EditUnitOfMeasurementComponent } from './edit-unit-of-measurement/edit-unit-of-measurement.component';
@Component({
  selector: 'app-unit-of-measurement',
  templateUrl: './unit-of-measurement.component.html',
  styleUrls: ['./unit-of-measurement.component.scss',
  '../../../../../assets/scss/scrollableTable.scss'
]
})

export class UnitOfMeasurementComponent implements OnInit  {

  @ViewChild('editCompany')
  editCompany!: EditUnitOfMeasurementComponent;

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

  purchaseUrl:boolean=false;

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
    this.getUserPermission();
    if(this.router.url=='/pms/settings/unit-of-measurement-purchase'){
      this.purchaseUrl=true;
    }
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }

  viewCompany() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
   // params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.companyList = data.results;
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

    this.apiservice.getUOMList(params).subscribe(data => {
      this.companyList = data.results;
    })
  }

  editcompanyid(id: any) {
    this.datasharedservice.saveLocalData('company_id', JSON.stringify(id));
    this.editCompany.getData(id);
  }

  deleteCompany(id: number) {
    this.deleteCompanyId = id;
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
    params.set('uom_id', this.deleteCompanyId);
    params.set('method', 'delete');
    this.apiservice.deleteUOMData(params).subscribe((res: any) => {
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
    var i=0;
    for (const item of this.companyList){
      i = i + 1;
      var obj = {
        S_No: i,
        symbol: item.symbol,
        formal_name: item.formal_name
        }
      this.CompanyData.push(obj);
    }

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      headers: ["S.No","Symbol","Formal Name"]
    };
    new ngxCsv(this.CompanyData,"UnitofMeasurementList", options);
    window.location.reload();
  }
  
  downloadPdf() {
    var i=0;
    for (const item of this.companyList){
      i = i + 1;
      var obj = [
        i,
        item.symbol,
        item.formal_name
      ]
      this.CompanyData.push(obj);
    }
   var  header= [["S.No.","Symbol","Formal Name"]];
    var doc = new jsPDF();
  (doc as any).autoTable({  head: header, body:this.CompanyData,styles: {overflow: 'linebreak',
  fontSize: 10} })
  doc.save("Unit of Measurement List");
  this.CompanyData=[];

  }

}
