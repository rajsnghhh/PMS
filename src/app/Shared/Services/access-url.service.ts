import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccessPermissionService } from './access-permission.service';

@Injectable({
  providedIn: 'root'
})
export class AccessUrlService {

  constructor(
    private accessPermissionService: AccessPermissionService,
    private toastrService: ToastrService
  ) { }
  //Need to put all the url which have Auth guard validation rest are not required.
  //If Url Have Auth guard still still permission not required then needs to set ""
  secureURL = [
    
    '/pms/dashbord',                           //6
    '/pms/usermanagement/manageUser',          //7
    '/pms/usermanagement/manageGroup',         //8
    '/pms/usermanagement/manageProfile',       //9

    '/pms/profile/view',                      //10
    '/pms/profile/resetpassword',             //11
    '/pms/usermanagement/userActivity',       //12
   
    '/pms/survey',                             //16
   
    '/pms/tender',                             //22
    '/pms/tender/evaluations-summary',         //23
    '/pms/tender/add-new',                     //24
    '/pms/tender/archived',                    //25
    '/pms/tender/tender-detail',               //26
    '/hrms/attendance',                        //27
    '/pms/insurance',                          //28
    '/pms/usermanagement/archived-user',       //30
    '/hrms/usermanagement/manageUser',         //31
    '/hrms/usermanagement/manageGroup',        //32
    '/hrms/usermanagement/manageProfile',      //33
    '/hrms/usermanagement/userActivity',       //34
    '/hrms/usermanagement/archived-user',      //35
    '/pms/survey/viewsurvey',                  //36
    '/pms/tender/wbs',                         //37
    '/pms/tender/executive-summary',           //38
    '/pms/tender/continue-survey',             //39
    '/pms/tender/tender-jv-detail',            //40
    '/pms/tender/continue-tender',             //41
    
    '/pms/tender/activity-tracker',            //45
    '/pms/tender/continue-tender/view',        //46
    '/pms/tender/continue-tender/edit',        //47
    '/pms/tender/tender-jv-master-details',    //48 
    '/pms/tender/employee-master-details',     //49
    
    '/home',                                   //62

  ]
  secureURLText = [
    
    'Dashboard',                          //6
    'Manage User',                        //7
    'Manage Group',                       //8
    'Manage Roles & Permission',          //9

    '',                                   //10
    '',                                   //11
    '',                                   //12
    
    'Survey',                             //16
   
    '',                                   //22
    '',                                   //23
    '',                                   //24
    '',                                   //25
    'Tender',                             //26
    '',                                   //27
    '',                                   //28
    '',                                   //30
    'Manage User',                        //31
    'Manage Group',                       //32
    'Manage Roles & Permission',          //33
    '',                                   //34
    '',                                   //35
    '',                                   //36
    '',                                   //37
    '',                                   //38
    '',                                   //39
    '',                                   //40
    '',                                   //41
    
    '',                                   //45
    '',                                   //46
    '',                                   //47
    '',                                   //48
    '',                                   //49
   
    '',                                   //62

  ]


  checkUrlPermission(url: string) {
    let temp = url.split('/').filter(x => isNaN(parseInt(x)))
    let filterUrl = ''
    for (let i = 0; i < temp.length; i++) {
      if (temp[i] != '') {
        filterUrl += '/' + temp[i]
      }
    }
    url = filterUrl
    if (this.secureURL.indexOf(url) >= 0) {
      let index = this.secureURL.indexOf(url)
      let text = this.secureURLText[index]
      if (text == '') {
        return true;
      } else {
        return this.accessPermissionService.getModulePermissions(text).level_permission;
      }
    } else {
      return false;
    }
  }

  checkModulePermission(moduleName: string) {
    if (moduleName == '') {
      return false;
    } else {
      return this.accessPermissionService.getModulePermissions(moduleName).level_permission;
    }
  }
}
