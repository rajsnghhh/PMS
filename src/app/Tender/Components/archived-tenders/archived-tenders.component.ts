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

@Component({
  selector: 'app-archived-tenders',
  templateUrl: './archived-tenders.component.html',
  styleUrls: ['./archived-tenders.component.scss',
  '../../../../assets/scss/scrollableTable.scss'
]
})
export class ArchivedTendersComponent implements OnInit {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  constructor(
    private router: Router,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
  }

  gotoTenderList() {
    this.router.navigate(['/pms/tender/add-new']);
  }

  restoreTender() {
    this.router.navigate(['/pms/tender/tender-detail']);
  }

  getPaginate() {
    // this.paginationservice.getPaginationData().subscribe(newPaginationData => {
    //   if (newPaginationData) {
    //     this.paginationValue = newPaginationData;
    //   }
    // });
    // this.pageSize = this.paginationValue.pagesizeValue;
    // this.page = this.paginationValue.pagevalue;
    // let params = new URLSearchParams();
    // this.queryParaMap.page_size = this.paginationValue.pagesizeValue;
    // this.queryParaMap.page = this.paginationValue.pagevalue;
    // this.getUserList();
  }

  downloadCsv() {
    // var i = 0;
    // for (const item of this.CompanyList) {
    //   i = i + 1;
    //   var obj = {
    //     S_No: i,
    //     name: item.name
    //   }
    //   this.CompanyData.push(obj);
    // }
    // var options = {
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalseparator: '.',
    //   showLabels: true,
    //   headers: ["S.No", "Company Name"]
    // };
    // new ngxCsv(this.CompanyData, "CompanyList", options);
    // window.location.reload();
  }

  downloadPdf() {
    // var i = 0;
    // for (const item of this.CompanyList) {
    //   i = i + 1;
    //   var obj = [
    //     i,
    //     item.name
    //   ]
    //   this.CompanyData.push(obj);
    // }
    // var header = [["S.No.", "Company Name"]];
    // var doc = new jsPDF();
    // (doc as any).autoTable({
    //   head: header, body: this.CompanyData, styles: {
    //     overflow: 'linebreak',
    //     fontSize: 10
    //   }
    // })
    // // doc.output('dataurlnewwindow');
    // doc.save("Company List");
    // this.CompanyData = [];
  }
  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
