import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
declare var window: any;


@Component({
  selector: 'app-tender-jv-list',
  templateUrl: './tender-jv-list.component.html',
  styleUrls: ['./tender-jv-list.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class TenderJvListComponent {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  @Input() public varName: string | undefined;

  localStorageData: any;
  TenderList: any = [];
  popupTenderList: any = [];

  TenderName: any = [];
  TenderJVList: any = [];

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  TenderType: any;
  TenderFilterName: any;
  TenderId: any;
  filtername: any;
  filteredName: any;
  CompanyData: any = [];
  TenderPermission: any;
  searchoffcanvas: any;

  actionList: any = [
    {
      id: 2,
      text: 'View Details'
    },

    {
      id: 5,
      text: 'Activity Tracker'
    },

    {
      id: 6,
      text: 'Archived Tender'
    },
  ];

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
    this.getTenderJVList();
    this.getUserPermission();
    this.setUpModalCanvas();
  }

  setUpModalCanvas() {
    this.searchoffcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightsearch')
    );
  }

  getUserPermission() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      this.TenderPermission = data.results[0].evaluation_summary_visible;
    })
  }

  queryParaMap: any = {
    page_size: 10,
    page: 1
  }

  getAllList() {
    this.queryParaMap.tender_status = 'all';
    this.getTenderJVList();
  }

  getIdentifiedList() {
    this.queryParaMap.tender_status = 'identified';
    this.getTenderJVList();
  }

  getRecommendedList() {
    this.queryParaMap.tender_status = 'recommended';
    this.getTenderJVList()
  }

  getProposedList() {
    this.queryParaMap.tender_status = 'proposed';
    this.getTenderJVList()
  }

  getApprovedList() {
    this.queryParaMap.tender_status = 'approved';
    this.getTenderJVList()
  }

  getRejectedList() {
    this.queryParaMap.tender_status = 'rejected';
    this.getTenderJVList();
  }

  getVGARejectedList() {
    this.queryParaMap.tender_status = 'vga_rejected';
    this.getTenderJVList();
  }

  getVGAapprovedList() {
    this.queryParaMap.tender_status = 'vga_done';
    this.getTenderJVList()
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

  getTenderId(id: any, item: any) {
    this.datasharedservice.saveLocalData('tender_id', JSON.stringify(id));
    if (item.text == 'WBS') {
      // this.router.navigate(['/pms/tender/wbs']);
    } else if (item.text == 'View Survey') {
      this.router.navigate(['/pms/survey/viewsurvey']);
    } else if (item.text == 'Executive Summary') {
      // this.router.navigate(['/pms/tender/executive-summary']);
    } else if (item.text == 'Continue Survey') {
      this.router.navigate(['/pms/tender/continue-survey']);
    } else if (item.text == 'Archived Tender') {
      this.toastrService.error('', 'Not Configured Yet', {
        timeOut: 2000,
      });
      // this.router.navigate(['/pms/tender/continue-survey']);
    } else if (item.text == 'View Details') {
      this.router.navigate(['/pms/tender/continue-tender/view/' + JSON.stringify(id)]);
    } else if (item.text == 'Activity Tracker') {
      this.router.navigate(['/pms/tender/activity-tracker']);
    } else {
      this.router.navigate(['/pms/survey/viewsurvey']);
    }
  }

  gotoAddNewTender() {
    this.router.navigate(['/pms/tender/add-new']);
  }

  goback() {
    this.router.navigate(['/pms/tender']);
  }

  statusprogressbar(id: any, index: any) {
    this.datasharedservice.saveLocalData('tender_id', JSON.stringify(id));
    this.popupTenderList = this.TenderJVList[index].status_map;
  }

  empMasterTender(data: any, id: any) {
    this.datasharedservice.saveLocalData('EvaluationJVTender', JSON.stringify(data));
    this.datasharedservice.saveLocalData('JVTenderId', JSON.stringify(id))
    this.router.navigate(['/pms/tender/employee-master-details']);
  }

  SearchTender() {
    this.searchoffcanvas.show()
  }

  searchData:any = {}
  closeSearchCanvas(data:any) {
    data = JSON.parse(data)
    this.TenderJVList = data.tenderList.results;
    this.searchData = data.setedQuery
    if(this.searchData == '') {
      this.getAllList()
    }
    this.searchoffcanvas.hide()
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
    let params = new URLSearchParams(this.queryParaMap);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_type', this.TenderType);
    params.set('list', 'true')
    for (var k in this.searchData){
      if (this.searchData.hasOwnProperty(k)) {
        params.set(k, this.searchData[k])
      }
    }
    this.apiservice.getTenderJVList(params).subscribe(data => {
      this.TenderJVList = data.results;
    })
  }

  downloadCsv() {
    let hadderlist = ['Sl.NO', 'Status', 'Tender Age']
    for (const item of this.TenderJVList[0].tender_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.TenderJVList.length; i++) {
      var obj = [i + 1, this.TenderJVList[i].tender_status, this.TenderJVList[i].tender_age]
      for (const inneritem of this.TenderJVList[i].tender_data) {
        obj.push(inneritem.value)
      }
      this.CompanyData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: [hadderlist]
    };
    new ngxCsv(this.CompanyData, "TenderJVList", options);
    window.location.reload();
  }

  downloadPdf() {
    let hadderlist = ['S.No', 'Status', 'Tender Age']
    for (const item of this.TenderJVList[0].tender_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.TenderJVList.length; i++) {
      var obj = [i + 1, this.TenderJVList[i].tender_status, this.TenderJVList[i].tender_age]
      for (const inneritem of this.TenderJVList[i].tender_data) {
        obj.push(inneritem.value)
      }
      this.CompanyData.push(obj);
    }
    var header = [hadderlist];
    var pdfsize = 'a0';
    var doc = new jsPDF('p', 'pt', 'a4');
    (doc as any).autoTable({
      head: header, body: this.CompanyData,
      startY: 10,
      startX: 0,
      styles: {
        overflow: 'linebreak',
        fontSize: 2,
      }
    })
    doc.save("Tender JV List");
    doc.output('dataurlnewwindow')
    this.CompanyData = [];
  }
  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
