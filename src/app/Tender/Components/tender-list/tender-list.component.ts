import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { Item } from 'angular2-multiselect-dropdown';

@Component({
  selector: 'app-tender-list',
  templateUrl: './tender-list.component.html',
  styleUrls: ['./tender-list.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class TenderListComponent implements OnInit {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  localStorageData: any;
  TenderList: any;
  TenderJVList: any = [];
  TenderPermission: any;
  tenderId: any;
  selectedTab: any = "";

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  TenderData: any = [];
  TenderDatas: any = [];
  TenderJVData: any = [];

  constructor(
    private router: Router,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.queryParaMap.is_active = 'false';
    this.viewTender();
    this.viewJVTender();
    this.getUserPermission();
  }

  queryParaMap: any = {
    page_size: 10,
    page: 1,
    organisation: ''
  }

  getUserPermission() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      this.TenderPermission = data.results[0].evaluation_summary_visible;
      if (this.TenderPermission == false) {
        // this.alltender('all');
        this.identifiertender('all');
      }
    })
  }

  identifiertender(data: any) {
    this.datasharedservice.saveLocalData('EvaluationTender', JSON.stringify(data));
    this.datasharedservice.saveLocalData('JV_Standalone', JSON.stringify('standalone'));
    this.router.navigate(['/pms/tender/tender-detail']);
  }

  viewTender() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getTenderSurveyList(params).subscribe(data => {
      this.TenderList = data.msg;
    })
  }

  viewJVTender() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getTenderJVList(params).subscribe(data => {
      this.TenderJVList = data.result;
    })
  }

  getTenderList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_type', 'all')
    this.apiservice.getTenderList(params).subscribe(data => {
      this.TenderData = data.results;
    })
  }

  alltender(data: any) {
    this.datasharedservice.saveLocalData('EvaluationTender', JSON.stringify(data));
    this.datasharedservice.saveLocalData('JV_Standalone', JSON.stringify('standalone'));
    // this.router.navigate(['/pms/tender/tender-detail']);
    
    if (data == 'not_applicable') {
      if (this.TenderList?.not_applicable_tender_count > 0) {
        this.router.navigate(['/pms/tender/tender-detail']);
      }
      else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });
      }
    } else if (data == 'single') {
      if (this.TenderList?.total_tender > 0) {
        this.router.navigate(['/pms/tender/tender-detail']);
      } else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });
      }
    } else if (data == 'participated_single') {
      if (this.TenderList?.total_tender_participated > 0) {
        this.router.navigate(['/pms/tender/tender-detail']);
      } else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });
      }
    } else if (data == 'technical_single') {
      if (this.TenderList?.technical_opened_tender_count > 0) {
        this.router.navigate(['/pms/tender/tender-detail']);
      } else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });
      }
    } else if (data == 'financial_single') {
      if (this.TenderList?.financial_opened_tender_count > 0) {
        this.router.navigate(['/pms/tender/tender-detail']);
      } else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });
      }
    } else if (data == 'l1_single') {
      if (this.TenderList?.standalone_l1_tender_count > 0) {
        this.router.navigate(['/pms/tender/tender-detail']);
      }
      else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });

      }
    }

  }

  alljvtender(data: any, id: any, index: any) {
    this.datasharedservice.saveLocalData('EvaluationJVTender', JSON.stringify(data));
    this.datasharedservice.saveLocalData('JV_Standalone', JSON.stringify('jv'));
    this.datasharedservice.saveLocalData('JVTenderId', JSON.stringify(id));
    if (data == 'jv') {
      if (this.TenderJVList[index].total_tender > 0) {
        this.router.navigate(['/pms/tender/tender-jv-detail']);
      }
      else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });
      }
    } else if (data == 'participated_jv') {
      if (this.TenderJVList[index]?.total_tender_participated > 0) {
        this.router.navigate(['/pms/tender/tender-jv-detail']);
      } else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });
      }
    } else if (data == 'technical_open_jv') {
      if (this.TenderJVList[index]?.technical_opened_tender_count > 0) {
        this.router.navigate(['/pms/tender/tender-jv-detail']);
      } else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });
      }
    } else if (data == 'financial_open_jv') {
      if (this.TenderJVList[index]?.financial_opened_tender_count > 0) {
        this.router.navigate(['/pms/tender/tender-jv-detail']);
      }
      else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });

      }
    } else if (data == 'l1_jv') {
      if (this.TenderJVList[index]?.jv_l1_tender_count > 0) {
        this.router.navigate(['/pms/tender/tender-jv-detail']);
      }
      else {
        this.toastrService.error(data.msg, 'No data found', {
          timeOut: 2000,
        });

      }
    }
  }


  viewtenderjvmaster(data: any, id: any) {
    this.datasharedservice.saveLocalData('EvaluationJVTender', JSON.stringify(data));
    this.datasharedservice.saveLocalData('JVTenderId', JSON.stringify(id))
    this.router.navigate(['/pms/tender/tender-jv-master-details']);
  }

  participatedTender() {
    // this.router.navigate(['/pms/tender/tender-detail']);
  }

  downloadCsv() {

    var objna = {
      S_No: '#',
      Entities: 'N/A',
      Total_Tender_Identified_Nos: this.TenderList?.not_applicable_tender_count,
   }
    this.TenderDatas.push(objna);

    var obj1 = {
      S_No: '#',
      Entities: 'Standalone-SINPL',
      Total_Tender_Identified_Nos: this.TenderList?.total_tender,
      Total_Participated_Identified_Nos: this.TenderList?.total_tender_participated,
      Total_Tender_Value_Participated_in_Crs: this.TenderList?.total_tender_participated_in_cr,
      Total_Bid_BG_Infused_Cuml_Eq_value_in_Crs: this.TenderList?.total_BidBG_infused,
      Tender_Technical_Opened_Nos: this.TenderList?.technical_opened_tender_count,
      Tender_Financial_Opened_Nos: this.TenderList?.financial_opened_tender_count,
      Tender_Financial_Opened_in_Crs: this.TenderList?.financial_opened_tender_sum_in_crs,
      Results_L1_SINPL_in_Nos: this.TenderList?.standalone_l1_tender_count,
      Results_L1_SINPL_in_Crs: this.TenderList?.standalone_l1_tender_sum_in_crs,
      Performance_Index_Percentage_of_Succes_by_Nos: this.TenderList?.performance_rate_by_nos,
      Performance_Index_Percentage_of_Succes_by_Value: this.TenderList?.performance_rate_by_value,
      Bid_BG_Returned_Eq_value_in_Crs: this.TenderList?.bg_returned_value,
      BG_Yet_to_Return_on_Fin_Opened_Eq_Value_in_Crs: this.TenderList?.bg_returned_on_financial_opened,
      BG_Yet_to_Return_For_No_Fin_Opened_Eq_Value_in_Crs: this.TenderList?.bg_yet_to_return_for_no_financial_opened,
    }
    this.TenderDatas.push(obj1);

    var obj2 = {
      S_No: '#',
      Entities: 'In JV with',
    }
    this.TenderDatas.push(obj2);

    var i = 0;
    for (const item of this.TenderJVList) {
      i = i + 1;
      var objjv = {
        S_No: i,
        Entities: item.name,
        Total_Tender_Identified_Nos: item.total_tender,
        Total_Participated_Identified_Nos: item.total_tender_participated,
        Total_Tender_Value_Participated_in_Crs: item.total_tender_participated_in_cr,
        Total_Bid_BG_Infused_Cuml_Eq_value_in_Crs: item.total_BidBG_infused,
        Tender_Technical_Opened_Nos: item.technical_opened_tender_count,
        Tender_Financial_Opened_Nos: item.financial_opened_tender_count,
        Tender_Financial_Opened_in_Crs: item.financial_opened_tender_sum_in_crs,

        Results_L1_SINPL_in_Nos: item.jv_l1_tender_count,
        Results_L1_SINPL_in_Crs: item.jv_l1_tender_sum_in_crs,
        Performance_Index_Percentage_of_Succes_by_Nos: item.performance_rate_by_nos,
        Performance_Index_Percentage_of_Succes_by_Value: item.performance_rate_by_value,
        Bid_BG_Returned_Eq_value_in_Crs: item.bg_returned_value,
        BG_Yet_to_Return_on_Fin_Opened_Eq_Value_in_Crs: item.bg_returned_on_financial_opened,
        BG_Yet_to_Return_For_No_Fin_Opened_Eq_Value_in_Crs: item.bg_yet_to_return_for_no_financial_opened,
      }
      this.TenderDatas.push(objjv);
    }

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Entities", "Total Tender Identified (Nos.)", "Total Participated Identified (Nos.)", "Total Tender Value Participated (₹ in Crs.)", "Total Bid BG Infused-Cuml. (Eq. value- ₹ in Crs.)", "Tender Technical Opened (Nos.)", "Tender Financial Opened (Nos.)", "Tender Financial Opened (₹ in Crs.)", "Results L1-SINPL (in Nos.)", "Results L1-SINPL (₹ in Crs.)", "Performance Index (% of Succes by Nos.)", "Performance Index (% of Succes by Value)", "Bid BG Returned (Eq. value- ₹ in Crs.)", "BG Yet to Return on Fin.Opened (Eq. Value ₹ in Crs.)", "BG Yet to Return for no Fin.Opened(Eq. Value ₹ in Crs.)"]
    };
    new ngxCsv(this.TenderDatas, "tenderList", options);
    window.location.reload();
  }

  downloadPdf() {

    var objna = [
      '#',
      'N/A',
      this.TenderList?.not_applicable_tender_count,
    ]
    this.TenderDatas.push(objna);

    var objsl = [
      '#',
      'Standalone-SINPL',
      this.TenderList?.total_tender,
      this.TenderList?.total_tender_participated,
      this.TenderList?.total_tender_participated_in_cr,
      this.TenderList?.total_BidBG_infused,
      this.TenderList?.technical_opened_tender_count,
      this.TenderList?.financial_opened_tender_count,
      this.TenderList?.financial_opened_tender_sum_in_crs,
      this.TenderList?.standalone_l1_tender_count,
      this.TenderList?.standalone_l1_tender_sum_in_crs,
      this.TenderList?.performance_rate_by_nos,
      this.TenderList?.performance_rate_by_value,
      this.TenderList?.bg_returned_value,
      this.TenderList?.bg_returned_on_financial_opened,
      this.TenderList?.bg_yet_to_return_for_no_financial_opened
    ]
    this.TenderDatas.push(objsl);

    var obj2 = [
      '#',
      'In JV with',
    ]
    this.TenderDatas.push(obj2);

    var i = 0;
    for (const item of this.TenderJVList) {
      i = i + 1;
      var objjv = [
        i,
        item.name,
        item.total_tender,
        item.total_tender_participated,
        item.total_tender_participated_in_cr,
        item.total_BidBG_infused,
        item.technical_opened_tender_count,
        item.financial_opened_tender_count,
        item.financial_opened_tender_sum_in_crs,
        item.jv_l1_tender_count,
        item.jv_l1_tender_sum_in_crs,
        item.performance_rate_by_nos,
        item.performance_rate_by_value,
        item.bg_returned_value,
        item.bg_returned_on_financial_opened,
        item.bg_yet_to_return_for_no_financial_opened
      ]
      this.TenderDatas.push(objjv);
    }

    var header = [["S.No", "Entities", "Total Tender Identified (Nos.)", "Total Participated Identified (Nos.)", "Total Tender Value Participated (₹ in Crs.)", "Total Bid BG Infused-Cuml. (Eq. value- ₹ in Crs.)", "Tender Technical Opened (Nos.)", "Tender Financial Opened (Nos.)", "Tender Financial Opened (₹ in Crs.)", "Results L1-SINPL (in Nos.)", "Results L1-SINPL (₹ in Crs.)", "Performance Index (% of Succes by Nos.)", "Performance Index (% of Succes by Value)", "Bid BG Returned (Eq. value- ₹ in Crs.)", "BG Yet to Return on Fin.Opened (Eq. Value ₹ in Crs.)", "BG Yet to Return for no Fin.Opened(Eq. Value ₹ in Crs.)"]];
    var pdfsize = 'a0';
    var doc = new jsPDF('l', 'pt', pdfsize);
    (doc as any).autoTable({
      head: header, body: this.TenderDatas, startY: 10, startX: 0,
      styles: {
        overflow: 'linebreak',
        fontSize: 5
      }
    })
    doc.save("Tender List");
    doc.output('dataurlnewwindow')
    this.TenderDatas = [];
  }

  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
