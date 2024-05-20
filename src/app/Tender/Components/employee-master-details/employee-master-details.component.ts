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
  selector: 'app-employee-master-details',
  templateUrl: './employee-master-details.component.html',
  styleUrls: ['./employee-master-details.component.scss',
  '../../../../assets/scss/scrollableTable.scss'
]
})

export class EmployeeMasterDetailsComponent {

  varValue: any = true;

  localStorageData: any;
  TenderList: any = [];
  empTenderList: any = [];
  empList: any = [];
  TenderName: any = [];
  TenderFilterName: any;
  paginationValue: any;
  pageSize: any = 10;
  page: any = 1;
  TenderId: any;
  popupTenderList: any=[];
  TenderJVList: any = [];
  CompanyData: any = [];

  actionList: any = [
    
    {
      id: 2,
      text: 'View Details'
    },
    
    {
      id: 5,
      text: 'Activity Tracker'
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
    this.queryParaMap.tender_status = 'all';
    this.TenderId = JSON.parse(this.datasharedservice.getLocalData('EmpTenderId'));
    this.viewEmpMasterDetails();
    this.viewempTenderinfo();
  }


  queryParaMap: any = {
    page_size: 10,
    page: 1,
    organisation: ''
  }

  getAllList() {
    this.queryParaMap.tender_status = 'all';
    this.viewempTenderinfo();
  }

  getIdentifiedList() {
    this.queryParaMap.tender_status = 'identified';
    this.viewempTenderinfo();
  }

  getRecommendedList() {
    this.queryParaMap.tender_status = 'recommended';
    this.viewempTenderinfo()
  }

  getProposedList() {
    this.queryParaMap.tender_status = 'proposed';
    this.viewempTenderinfo()
  }

  getApprovedList() {
    this.queryParaMap.tender_status = 'approved';
    this.viewempTenderinfo()
  }

  getRejectedList() {
    this.queryParaMap.tender_status = 'rejected';
    this.viewempTenderinfo();
  }

  getVGARejectedList() {
    this.queryParaMap.tender_status = 'vga_rejected';
    this.viewempTenderinfo();
  }

  getVGAapprovedList() {
    this.queryParaMap.tender_status = 'vga_done';
    this.viewempTenderinfo()
  }

  viewempTenderinfo() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_status', this.queryParaMap.tender_status);
    params.set('page_size', this.pageSize);
    params.set('page', this.page);
    params.set('list', 'true');
    params.set('employee_id', this.TenderId);
    this.apiservice.getTenderList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.empTenderList = data.results;
      this.TenderName = data;
    })
    this.TenderFilterName = this.queryParaMap.tender_status.replace(/_/g, " ");
  }

  viewEmpMasterDetails() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getEmployeeMasterList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].id == this.TenderId) {
          this.empList = data.results[i];
        }
      }
    })
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
    } else if (item.text == 'View Details') {
      this.router.navigate(['/pms/tender/continue-tender/view/'+JSON.stringify(id)]);
    } else if (item.text == 'Activity Tracker') {
      this.router.navigate(['/pms/tender/activity-tracker']);
    } else {
      this.router.navigate(['/pms/survey/viewsurvey']);
    }
  }

  statusprogressbar(id : any,index:any) {
    this.datasharedservice.saveLocalData('tender_id', JSON.stringify(id));
    this.popupTenderList=this.empTenderList[index].status_map;
  }

  gotoAddNewTender() {
    this.router.navigate(['/pms/tender/add-new']);
  }

  goback() {
    this.router.navigate(['/pms/settings/employee-master']);
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
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_status', this.queryParaMap.tender_status);
    params.set('page_size', this.pageSize);
    params.set('page', this.page);
    params.set('list', 'true');
    params.set('employee_id', this.TenderId);
    this.apiservice.getTenderList(params).subscribe(data => {
      this.empTenderList = data.results;
    })
  }

  downloadCsv() {
    let hadderlist = ['Sl.NO', 'Status', 'Tender Age']
    for (const item of this.empTenderList[0].tender_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.empTenderList.length; i++) {
      var obj = [i + 1, this.empTenderList[i].tender_status, this.empTenderList[i].tender_age]
      for (const inneritem of this.empTenderList[i].tender_data) {
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
    new ngxCsv(this.CompanyData, "empTenderList", options);
    window.location.reload();
  }

  downloadPdf() {
    let hadderlist = ['S.No', 'Status', 'Tender Age']
    for (const item of this.empTenderList[0].tender_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.empTenderList.length; i++) {
      var obj = [i + 1, this.empTenderList[i].tender_status, this.empTenderList[i].tender_age]
      for (const inneritem of this.empTenderList[i].tender_data) {
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

}
