import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { EditMaterialTypesComponent } from './edit-material-types/edit-material-types.component';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';

@Component({
  selector: 'app-material-types',
  templateUrl: './material-types.component.html',
  styleUrls: ['./material-types.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
    '../../../../../assets/scss/from-coomon.scss'

  ]
})

export class MaterialTypesComponent {

  @ViewChild('editCompany')
  editCompany!: EditMaterialTypesComponent;

  companyForm!: FormGroup;
  countrylist: any;
  deleteCompanyId: any;
  companyList: any = [];
  localStorageData: any;
  Companycsvdownload: any;
  CompanyData: any = [];
  userPermissions: any = {}
  CompanyList: any;
  purchaseAcntStatus: any;
  salesAcntStatus: any;
  purchaseUrl:boolean=false;
  itemTypelist: any;
  accountNameList:any;

  addUser: any = {
    name: '',
    purchaseAccount: '',
    salesAccount: '',
    itemtype: '',
  }

  constructor(
    private apiservice: APIService,
    private router: Router,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private procurementAPIService:PROCUREMENTAPIService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewCompany();
    this.getUserPermission();
    this.getItemType();
    this.getAccount();
    if(this.router.url=='/pms/settings/material-types-purchase'){
      this.purchaseUrl=true;
    }
  }

  getAccount(){
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getAccountHead(params).subscribe(data => {
    this.accountNameList = data.results;
    });
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }
  getItemType() {
    this.apiservice.getItemType().subscribe(data => {
      this.itemTypelist = data.results;
    })
  }

  showPurCombo(status: any) {
    this.purchaseAcntStatus = status;
  }
  showSalesPurCombo(status: any) {
    this.salesAcntStatus = status;
  }

  onSearch() {
    if (this.salesAcntStatus == 'Not Assigned') {
      this.addUser.salesAccount = '';
    }
    if (this.purchaseAcntStatus == 'Not Assigned') {
      this.addUser.purchaseAccount = '';
    }

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('name', this.addUser.name);
    params.set('purchase_account', this.addUser.purchaseAccount);
    params.set('item_type', this.addUser.itemtype);
    params.set('sales_account', this.addUser.salesAccount);

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.companyList = data.results;
      this.companyList = this.companyList.filter((el: any) => {

        if (el.parent == null) {
          return el
        }
      })
    })
  }

  viewCompany() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.companyList = data.results;
      this.companyList = this.companyList.filter((el: any) => {

        if (el.parent == null) {
          return el
        }
      })
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
    params.set('id', this.deleteCompanyId);
    params.set('method', 'delete');
    this.apiservice.deleteMaterialTypeData(params).subscribe((res: any) => {
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
    for (const item of this.companyList) {
      i = i + 1;
      var obj = {
        S_No: i,
        name: item.name,
        code: item.code,
        item_type: item.item_type,
        purchase_account: item.purchase_account,
        sale_account: item.sales_account,
        tolerance_level: item.tolerance_level
      }
      this.CompanyData.push(obj);
    }

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Material Group Name"]
    };
    new ngxCsv(this.CompanyData, "MaterialTypeName", options);
    window.location.reload();
  }

  downloadPdf() {
    var i = 0;
    for (const item of this.companyList) {
      i = i + 1;
      var obj = [
        i,
        item.name
      ]
      this.CompanyData.push(obj);
    }
    var header = [["S.No.", "Material Group Name"]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.CompanyData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    doc.save("Material Group List");
    this.CompanyData = [];

  }

}
