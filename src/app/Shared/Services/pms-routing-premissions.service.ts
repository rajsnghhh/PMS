import { Injectable } from '@angular/core';
import { AccessPermissionService } from './access-permission.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSharedService } from './data-shared.service';

@Injectable({
  providedIn: 'root'
})
export class PmsRoutingPremissionsService {

  constructor(
    private accesspermissionservice: AccessPermissionService,
    private router: Router,
    private toastrService: ToastrService,
    private dataShareService: DataSharedService
  ) { }

  ProceedToPMS() {
    let manageUser = this.accesspermissionservice.getModulePermissions('Manage User').level_permission;
    let dashboard = this.accesspermissionservice.getModulePermissions('Dashboard').level_permission;
    // let survey = this.accesspermissionservice.getModulePermissions('Survey').level_permission;
    let Store = this.accesspermissionservice.getModulePermissions('Store').level_permission;
    let Purchase = this.accesspermissionservice.getModulePermissions('Purchase').level_permission;
    let Tender = this.accesspermissionservice.getModulePermissions('Tender').level_permission;
    let Project = this.accesspermissionservice.getModulePermissions('Project').level_permission;
    // this.router.navigateByUrl('/pms/settings/setting-details'); //Temp changes for Demo After discussion with Joy Karmakar
    if (dashboard) {
      this.dataShareService.saveLocalData('ActiveModule', 'Dashboard');
      this.router.navigateByUrl('/pms/dashbord');
    } else if (Tender) {
      this.dataShareService.saveLocalData('ActiveModule', 'Tender');
      this.router.navigateByUrl('/pms/tender/evaluations-summary');
    } else if (Project) {
      this.dataShareService.saveLocalData('ActiveModule', 'Project');
      this.router.navigateByUrl('/pms/project');
    } else if (Store) {
      this.dataShareService.saveLocalData('ActiveModule', 'Store');
      this.router.navigateByUrl('/pms/store/procurement/dashboard');
    } else if (Purchase) {
      this.dataShareService.saveLocalData('ActiveModule', 'Purchase');
      this.router.navigateByUrl('/pms/purchase/procurement/dashboard');
    } else if (manageUser) {
      this.dataShareService.saveLocalData('ActiveModule', 'User Management');
      this.router.navigateByUrl('/pms/usermanagement/manageUser');
    } else {
      this.toastrService.error("Sorry, you don't have permission to any module. Please connect with your reporting manager.", '', {
        timeOut: 2000,
      });
    }

  }
}
