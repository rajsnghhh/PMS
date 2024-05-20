import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessPermissionService } from 'src/app/Shared/Services/access-permission.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { HRMSAPIService } from '../HRMS-Services/hrmsApi.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { environment } from "src/environments/environment";
import { ToastrService } from 'ngx-toastr';
import { PmsRoutingPremissionsService } from 'src/app/Shared/Services/pms-routing-premissions.service';

@Component({
  selector: 'app-hrms-header',
  templateUrl: './hrms-header.component.html',
  styleUrls: ['./hrms-header.component.scss']
})
export class HrmsHeaderComponent implements OnInit {
  userData: any
  settingsData:any
  notificationData:any
  environment = environment

  constructor(
      public router: Router,
      private datasharedservice: DataSharedService,
      private apiservice: HRMSAPIService,
      private accessPermissionService: AccessPermissionService,
      private commonFunction: CommonFunctionService,
      private pmsRoutingPremissionsService : PmsRoutingPremissionsService

  ) { }
  ngOnInit(): void {
      this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'))
      this.getSettingList()
      this.getNotificationList();
  }
  Logout() {
      this.apiservice.userLogout().subscribe(data => {
      })
      this.datasharedservice.clearLocalData();
      sessionStorage.clear();
      this.router.navigate(['/login'])
          .then(() => {
              window.location.reload();
          });
  }

  RouteToRoll(route: any) {
      this.router.navigate([route])
          .then(() => {
              window.location.reload();
          });
  }
  
  getPermissionchild(moduleName: string) {
      return this.accessPermissionService.getModulePermissions(moduleName).level_permission
  }

  NavigatetoPMS(){
    this.pmsRoutingPremissionsService.ProceedToPMS()
  }

  getSettingList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
        settings_for: 'HRMS'
      }
    )
    this.apiservice.getSettingList(query).subscribe((data: any) => {
      this.settingsData = data;
    })
  }

  viewAll() {
    this.router.navigate(['/hrms/settings/setting-details']).then(() => {
      window.location.reload();
    });
  }
  
  NavigateToSetting(navTarget: string, navName: string) {
    this.commonFunction.NavigateToSetting(navTarget,navName)
  }

  getNotificationList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('page_size', '6');
    params.set('page', '1');
    this.apiservice.getNotificationList(params).subscribe((data: any) => {
      this.notificationData = data.results;
    })
  }

}


