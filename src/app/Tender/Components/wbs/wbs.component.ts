import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { EditWbsComponent } from './edit-wbs/edit-wbs.component';
declare var window: any;


@Component({
  selector: 'app-wbs',
  templateUrl: './wbs.component.html',
  styleUrls: ['./wbs.component.scss',
  '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class WBSComponent implements OnInit{

  @ViewChild('editWBSValue')
  editWBSValue!: EditWbsComponent;

  @Input()
  TenderNumber!: any;

  localStorageData: any;
  WbsList: any = [];
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  CompanyData: any = [];
  addWBSCanvas:any;
  editWBSCanvas:any;
  selectedTender = '';
  deleteId:any;

  constructor(
    private router: Router,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.selectedTender = this.TenderNumber
    this.setUpModelCanvas()
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewWbsList();
  }
  
  setUpModelCanvas() {
    this.addWBSCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('addWBSCanvas')
    );
    this.editWBSCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('editWBSCanvas')
    );
  }

  AddNewWBS() {
    this.addWBSCanvas.show()
  }
  editWBSData(editid:any){
    this.editWBSValue.getData(editid);
    this.editWBSCanvas.show();
  }
  closeUserCanvas() {
    this.addWBSCanvas.hide();
    this.editWBSCanvas.hide();
    this.viewWbsList();
  }

  viewWbsList() {
    let params = new URLSearchParams();
    if(this.selectedTender) {
      params.set('tender_id', this.selectedTender);
    } else {
      params.set('is_master', '1');
    }
    params.set('page_size', this.pageSize);
    params.set('page', this.page);
    params.set('is_parent_null', 'true')

    this.apiservice.getWbsList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.WbsList = data.results;
    })
  }

  deleteWBS(delId:any){
   this.deleteId=delId;
  }
  finalDeleteWbs(){
    let params = new URLSearchParams();
    params.set('method', 'delete');
    params.set('wbs_id', this.deleteId);
    this.apiservice.deleteWbs(params).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
    this.viewWbsList();
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
    if(this.selectedTender) {
      params.set('tender_id', this.selectedTender);
    } else {
      params.set('is_master', '1');
    }
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)
    params.set('is_parent_null', 'true')

    this.apiservice.getWbsList(params).subscribe(data => {
      this.WbsList = data.results;
    })
  }

  downloadCsv() {
    var i = 0;
    for (const item of this.WbsList) {
      i = i + 1;
      for(let data of item.key_scopes){

      var obj = {
        wbs: item.wbs_name,
        key_scope: data.keyscope,
        UOM: data.unit
      }
      
      this.CompanyData.push(obj);
    }
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["WBS", "Key Scope", "UOM"]
    };
    new ngxCsv(this.CompanyData, "CompanyList", options);
    window.location.reload();
  }

  downloadPdf() {
    var i = 0;
    for (const item of this.WbsList) {
      i = i + 1;
          for(let data of item.key_scopes){
      var obj = [
        item.wbs_name,
        data.keyscope,
        data.unit
      ]
      this.CompanyData.push(obj);

    }
    }
    var header = [["WBS", "Key Scope", "UOM"]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.CompanyData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    doc.save("KEY ITEMS");
    this.CompanyData = [];
  }

}
