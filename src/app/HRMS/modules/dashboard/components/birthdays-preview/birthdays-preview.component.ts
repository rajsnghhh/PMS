import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-birthdays-preview',
  templateUrl: './birthdays-preview.component.html',
  styleUrls: ['./birthdays-preview.component.scss']
})
export class BirthdaysPreviewComponent implements OnInit{
  userData:any
  birthdayList:any

  currentDate = ''

  constructor(
    private apiservice: HRMSAPIService,
    private datasharedservice: DataSharedService
  ) {

  }
  
  noticeBoard: OwlOptions = {
    loop: true,
    margin: 10,
    autoplayTimeout:2500,
    autoplay:true,
    navText: ['<span class="fa fa-angle-left fa-3x"></span>','<span class="fa fa-angle-right fa-3x"></span>'],                 
    responsive: {
      0: {
        items: 2,
        nav: true
      },
      600: {
        items: 2,
        nav: false
      },
      1000: {
        items: 2,
        nav: true,
        loop: false,
        margin: 0
      }
    }
  }

  ngOnInit(): void {
    this.currentDateCalculator()
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getUpCmingBday();
  }

  currentDateCalculator() {
    let date = new Date()
    let day = date.getDate();
    let Tempday = ''
    if(day.toString().length < 2) {
      Tempday = '0'+day
    }else {
      Tempday = day.toString()
    }
    let month = date.getMonth()+1;
    let Tempmonth = ''
    if(month.toString().length < 2) {
      Tempmonth = '0'+month
    }else {
      Tempmonth = month.toString()
    }
    this.currentDate = Tempmonth+"-"+Tempday
  }

  getUpCmingBday() {  
    this.apiservice.getUpCmingBday(this.userData.organisation_details[0].id).subscribe(data => {
      this.birthdayList = data.result;
    })
  }
}
