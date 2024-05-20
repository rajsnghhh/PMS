import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss']
})
export class OnBoardingComponent {
  environment = environment.API_URL1
  constructor(
    private apiservice: HRMSAPIService,
    private datasharedservice: DataSharedService
  ) {

  }

  userData:any
  newJoineeList:any = []
  noticeBoard: OwlOptions = {
    loop: true,
    margin: 10,
    autoplayTimeout:2500,
    autoplay:true,
    navText: ['<span class="fa fa-angle-left fa-3x"></span>','<span class="fa fa-angle-right fa-3x"></span>'],                 
    responsive: {
      0: {
        items: 4,
        nav: true
      },
      600: {
        items: 4,
        nav: false
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
        margin: 0
      }
    }
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getNewJoinerList();
  }

  getNewJoinerList() {  
    this.apiservice.getNewJoinerList(this.userData.organisation_details[0].id).subscribe(data => {
      this.newJoineeList = data.result;
    })
  }
}
