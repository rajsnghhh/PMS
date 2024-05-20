import { Component, OnInit } from '@angular/core';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { AccessPermissionService } from '../Shared/Services/access-permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashbord-main',
  templateUrl: './dashbord-main.component.html',
  styleUrls: ['./dashbord-main.component.scss']
})
export class DashbordMainComponent implements OnInit {

  constructor(
    private datasharedservice:DataSharedService,
    private accessPermissionService: AccessPermissionService,
    private router : Router
  ) { }

  userData : any

  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'))
  }

  menuList = [
    {
      name : 'Dashboard',
      route : '/pms/dashbord',
      permission : 'Dashboard',
      bannerImg : 'DashboardBN.jpg',
      backColor : ''
    },
    {
      name : 'User Management',
      route : '/pms/usermanagement/manageUser',
      permission : 'User Management',
      bannerImg : 'User ManagementB.jpg',
      backColor : ''
    },
    {
      name : 'Tender',
      route : '/pms/tender/evaluations-summary',
      permission : 'Tender',
      bannerImg : 'tenderB.jpg',
      backColor : ''
    },
    {
      name : 'Store',
      route : '/pms/store/procurement/dashboard',
      permission : 'Store',
      bannerImg : 'storeB.jpg',
      backColor : ''
    },
    {
      name : 'Purchase',
      route : '/pms/purchase/procurement/dashboard',
      permission : 'Purchase',
      bannerImg : 'PurchaseB.jpg',
      backColor : ''
    },
    {
      name : 'Project',
      route : '/pms/project',
      permission : 'Project',
      bannerImg : 'projectB.jpg',
      backColor : ''
    },
    {
      name : 'Plant & Machinery',
      route : '/pms/plant_machinary',
      permission : 'Plant & Machinery',
      bannerImg : 'Plant & Machinery.jpg',
      backColor : ''
    },
    {
      name : 'Insurance',
      route : '/pms/insurance/insurance',
      permission : 'Insurance',
      bannerImg : 'Insurance.jpg',
      backColor : ''
    }

  ]

  

  routeTransfer(route: any,navName:string) {
    this.datasharedservice.saveLocalData('ActiveModule',navName);
    if (route) {
      this.router.navigateByUrl(route).then(() => {
        window.location.reload();
      });
    }
  }

  permissionData: any = {}

  permissionScope = ['add','delete','edit','export','level_permission','view']
  getPermissionchild(moduleName: string, actionName : string) {
    
    let scope = moduleName in this.permissionData
    if (!scope) {
      this.permissionData[moduleName] = this.accessPermissionService.getModulePermissions(moduleName)
    }
    if(actionName == '') {
      return this.permissionData[moduleName].level_permission
    }else {
      if(this.permissionScope.includes(actionName)) {
        return this.permissionData[moduleName][actionName]
      } else {
        /// Scope for Approver Permissions 
        let innerscope = 'userApprovalPermissions' in this.permissionData
        if (!innerscope) {
          this.permissionData['userApprovalPermissions'] = this.userData.user_permissions
        }
        if(this.permissionData['userApprovalPermissions'].includes(actionName)) {
          return true
        } else {
          return false
        }
      }
    }

  }

}
