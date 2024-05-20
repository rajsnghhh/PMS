import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccessPermissionService } from '../Shared/Services/access-permission.service';
import { APIService } from '../Shared/Services/api.service';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { CommonFunctionService } from '../Shared/Services/common-function.service';
import { environment } from "src/environments/environment";
import { NotificationService } from '../Shared/Services/notification.service';
import { PmsRoutingPremissionsService } from '../Shared/Services/pms-routing-premissions.service';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from '../Procurement/shared/PROCUREMENT-Services/procurementApi.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderModuleComponent implements OnInit {


  @Output() someEvent = new EventEmitter<any>();

  toggleIcon:boolean=true;
  userData: any
  settingsData: any
  masterSetting: any
  purchaseMasterSetting:any
  notificationData: any
  environment = environment
  tempUserData: any
  constructor(
    public router: Router,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private accessPermissionService: AccessPermissionService,
    private commonFunction: CommonFunctionService,
    private notificationService: NotificationService,
    private pmsRoutingPremissionsService: PmsRoutingPremissionsService,
    private toastrService: ToastrService,
    private procurementApiService:PROCUREMENTAPIService
  ) {
    this.datasharedservice.onReloadHeader().subscribe(data => {
      if (data) {
        if (data == 'reload') {
          this.getData()
        }
      }
    });
    router.events.subscribe((val) => {
      this.autoColaps()
    });
  }

  getData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('id', this.userData.user_id);
    params.set('profile', '1');
    this.apiservice.getProfileList(params).subscribe(data => {
      this.tempUserData = data.results[0];
      this.userData.cu_profile_img = this.tempUserData.image
      this.userData.first_name = this.tempUserData.first_name
      this.userData.last_name = this.tempUserData.last_name
      this.datasharedservice.saveLocalData('userDATA', JSON.stringify(this.userData));
      this.getSettingList();
      this.getNotificationList();
    })
  }

  financialYearData : any = []
  selectedFinancialYear = ''

  getFinancoialYearData() {
    let query = this.commonFunction.getURL(
      {
        order_by: '-name',
        all : 'true'
      }
    )
    this.procurementApiService.getFinanCialyrDataQry(query).subscribe(data => {
      this.financialYearData = data.results;      
      this.selectedFinancialYear = this.userData.financial_year[0].id
    })
  }

  changeFinacialYearData() {
    this.userData.financial_year = this.financialYearData.filter((item: { id: string; }) => item.id == this.selectedFinancialYear)
    this.datasharedservice.saveLocalData('userDATA',JSON.stringify(this.userData))
    window.location.reload()
  }

  callParent(val:any): void {
    this.toggleIcon=val;
    this.someEvent.emit(val);
  }

  NavigatetoPMS() {
    this.pmsRoutingPremissionsService.ProceedToPMS()
  }

  permissionData : any = {}

  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'))
    this.getProjectList()
    this.getSettingList()
    this.notificationService.setNotificationData()
    this.getNotificationList()
    this.getFinancoialYearData()
  }


  autoColaps() {
    if (
      this.router.url.indexOf('/tender/add-new') > -1 ||
      this.router.url.indexOf('/tender/continue-tender/view/') > -1 ||
      this.router.url.indexOf('/pms/planning/') > -1 || 
      this.router.url.indexOf('/tender/continue-tender/edit/') > -1
    ) {      
      this.callParent(false)
    }
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
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    } else {
      this.toastrService.error("Development Under progress for this URL!", '', {
        timeOut: 2000,
      });
    }
  }
  getPermissionchild(moduleName: string) {
    if(moduleName in this.permissionData){
      return this.permissionData[moduleName]
    } else {
      this.permissionData[moduleName] = this.accessPermissionService.getModulePermissions(moduleName).level_permission
      return this.permissionData[moduleName]
    }
  }

  getSettingList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
        settings_for: 'PMS'
      }
    )
    this.apiservice.getSettingList(query).subscribe((data: any) => {
      this.settingsData = data;
      for (let val of this.settingsData) {
        if (val.name == 'Store Master') {
          this.masterSetting = val.settings_details;
        }
        if (val.name == 'Purchase Master') {
          this.purchaseMasterSetting = val.settings_details;
        }
      }
    })
  }

  getNotificationList() {
    this.notificationService.getNotificationData().subscribe(data => {
      this.notificationData = data;
    });
  }

  NavigateToSetting(navTarget: string, navName: string) {
    this.commonFunction.NavigateToSetting(navTarget, navName)
  }

  viewAll() {
    this.router.navigate(['/pms/settings/setting-details']).then(() => {
      window.location.reload();
    });
  }

  viewAllNotification() {
    this.router.navigate(['/pms/notification']).then(() => {
      window.location.reload();
    });
  }


  generateList(data: any) {
    let list = []
    for (let i = 0; i < data.length; i++) {
      list.push('Setting ' + data[i].name)
    }
    return list
  }

  getMultiLablePermission(data: any) {
    return this.accessPermissionService.getModulePermissionsMultiple(data)
  }


  selectedProject = ''
  selectedSite = ''

  projectList:any = []

  changeProject() {
    let filter = this.projectList.filter((item: { id: string; }) => item.id == this.selectedProject)
    this.userData.project_data = filter[0]
    this.userData.site_data = filter[0].site_details[0]
    this.datasharedservice.saveLocalData('userDATA',JSON.stringify(this.userData))
    window.location.reload()
  }

  changeSite() {
    let filter = this.siteList.filter((item: { id: string; }) => item.id == this.selectedSite)
    this.userData.site_data = filter[0]
    this.datasharedservice.saveLocalData('userDATA',JSON.stringify(this.userData))
    window.location.reload()
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('list', 'true');
    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results;
      if(this.projectList.length == 0) {
        delete this.userData.project_data
      }
      if(!this.userData.project_data && this.projectList.length > 0) {
        this.userData.project_data = this.projectList[0]
        this.userData.site_data = this.projectList[0].site_details[0]
      }
      this.datasharedservice.saveLocalData('userDATA',JSON.stringify(this.userData))
      if(this.userData.project_data) {
        this.selectedProject = this.userData.project_data.id
      }
      if(this.userData.site_data) {
        this.selectedSite = this.userData.site_data.id
      }
      if(this.projectList.length > 0) {
        this.getSiteList()
      }

    })
  }

  siteList :any = []
  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('project', this.selectedProject);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })

  }

}

