import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-notice-board',
  templateUrl: './notice-board.component.html',
  styleUrls: ['./notice-board.component.scss']
})
export class NoticeBoardComponent implements OnInit {
  noticeBoard: OwlOptions = {
    loop: true,
    margin: 10,
    autoplayTimeout: 2500,
    autoplay: true,
    autoplayHoverPause: true,
    navText: ['<span class="fa fa-angle-left fa-3x"></span>', '<span class="fa fa-angle-right fa-3x"></span>'],
    responsive: {
      0: {
        items: 1,
        nav: true
      },
      600: {
        items: 1,
        nav: false
      },
      1000: {
        items: 1,
        nav: true,
        loop: false,
        margin: 0
      }
    }
  }
  userData: any
  noticeData: any
  environment = environment;
  constructor(
    private apiservice: HRMSAPIService,
    private datasharedservice: DataSharedService,
  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getNoticeData();
  }

  getNoticeData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    this.apiservice.getNoticeData(params).subscribe(data => {
      this.noticeData = data;
    })
  }
}
