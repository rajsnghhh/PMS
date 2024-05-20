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
import { EditMaterialCostHeadsComponent } from './edit-material-cost-heads/edit-material-cost-heads.component';

@Component({
  selector: 'app-material-cost-heads',
  templateUrl: './material-cost-heads.component.html',
  styleUrls: ['./material-cost-heads.component.scss',
  '../../../../../assets/scss/scrollableTable.scss'
]

})
export class MaterialCostHeadsComponent {

  @ViewChild('editCompany')
  editCompany!: EditMaterialCostHeadsComponent;

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
    this.getUserPermission();
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }

  viewCompany() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialCostList(params).subscribe(data => {
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

    this.apiservice.getMaterialCostList(params).subscribe(data => {
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
    params.set('m_sub_cost_head_id', this.deleteCompanyId);
    params.set('method', 'delete');
    this.apiservice.deleteMaterialCostData(params).subscribe((res: any) => {
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
        name: item.name
      }
      this.CompanyData.push(obj);
    }

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Material Cost Head"]
    };
    new ngxCsv(this.CompanyData, "MaterialCostHeadList", options);
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
    var header = [["S.No.", "Material Cost Head"]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.CompanyData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    doc.save("Material Cost Head List");
    this.CompanyData = [];

  }


}
