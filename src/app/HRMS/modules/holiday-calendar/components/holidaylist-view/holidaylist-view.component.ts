import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'

@Component({
  selector: 'app-holidaylist-view',
  templateUrl: './holidaylist-view.component.html',
  styleUrls: ['./holidaylist-view.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class HolidaylistViewComponent implements OnInit {

  localStorageData: any;
  holidayList: any = [];
  HolidayData: any = [];
  HolidayList: any = [];

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;


  constructor(
    private apiservice: HRMSAPIService,
    private router: Router,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private paginationservice: PaginationService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewHoliday();
    this.viewDownloadHoliday();
  }

  viewHoliday() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('country', this.localStorageData.country[0].iso2);
    params.set('state_id', this.localStorageData.state[0].state_id);
    this.apiservice.getholidayList(params).subscribe(data => {
      this.holidayList=data;
    })
  }

  viewDownloadHoliday() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('country', this.localStorageData.country[0].iso2);
    params.set('state_id', this.localStorageData.state[0].state_id);
    this.apiservice.getholidayList(params).subscribe(data => {
      this.HolidayList=data;
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

    this.apiservice.getholidayList(params).subscribe(data => {
      this.holidayList = data;
    })
  }

  downloadCsv() {
    var i = 0;
    for (const item of this.HolidayList) {
      i = i + 1;
      var obj = {
        S_No: i,
        Holiday_Name: item.name,
        Date: item.date,
        Is_Optional: 'NO',
        State: item.state_name
      }
      this.HolidayData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Holiday Name", "Date", "Is optional?", "State"]
    };
    new ngxCsv(this.HolidayData, "HolidayList", options);
    window.location.reload();
  }

  downloadPdf() {
    var i = 0;
    for (const item of this.HolidayList) {
      i = i + 1;
      var obj = [
        i,
        item.name,
        item.date,
        'NO',
        item.state_name
      ]
      this.HolidayData.push(obj);
    }
    var header = [["S.No.", "Holiday Name", "Date", "Is optional?", "State"]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.HolidayData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    doc.save("Holiday List");
    this.HolidayData = [];
  }

}
