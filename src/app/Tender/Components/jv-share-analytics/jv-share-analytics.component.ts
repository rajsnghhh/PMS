import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'app-jv-share-analytics',
  templateUrl: './jv-share-analytics.component.html',
  styleUrls: [
    './jv-share-analytics.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class JvShareAnalyticsComponent implements OnChanges {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  @Input()
  TenderNumber!:any

  @Input()
  selectedTab!:any

  analyticsData:any = []
  analyticsData1:any = []

  constructor(
    private commonFunction:CommonFunctionService,
    private apiservice:APIService,
    private toastrService:ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.TenderNumber != '') {
      this.getJVAnalytics1()
    }
  }

  getJVAnalytics1() {
    let query = this.commonFunction.getURL(
      {
        tender_id: this.TenderNumber
      }
    )
    this.apiservice.getJVAnalytics1(query).subscribe((data: any) => {
      this.analyticsData1 = data.result[0]
    }, err => {
      if (err.error.error) {
        this.toastrService.error(err.error.error, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })

  }
  
  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
