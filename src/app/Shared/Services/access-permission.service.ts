import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataSharedService } from './data-shared.service';

@Injectable({
  providedIn: 'root'
})
export class AccessPermissionService {
  private UserAccess = new BehaviorSubject<any>({});

  ModulePermissionArray: any = []

  ModulePermissions: any = []

  AdMiniStrativePermissionArray = [
    "PURCHASE ORDER",
    "VENDOR RFQ",
    "QUATATION"
  ]

  AdminPermissions: any = [];

  SettingPermission: any = [];
  constructor(
    private datasharedservice: DataSharedService
  ) { }
  accessData = []
  // setModuleAccess(data: any) {
  //   return this.filterAccess(data)
  // }

  setAdministrativeAccess(data: any) {
    return this.filterAdministrative(data)
  }
  // setSettingAccess(data: any) {
  //   return this.filterSetting(data)
  // }


  generatePermissionObject(settingPermission: any, modulePermissions: any) {
    let PermissionModuleList = []
    let permissionAyyay = []
    for (let j = 0; j < settingPermission.length; j++) {
      PermissionModuleList.push('Setting '+settingPermission[j].itemName)
      permissionAyyay.push({
        itemName: 'Setting '+settingPermission[j].itemName,
        add: settingPermission[j].add,
        delete: settingPermission[j].delete,
        edit: settingPermission[j].edit,
        export: settingPermission[j].export,
        view: settingPermission[j].view,
        level_permission: settingPermission[j].level_permission
      })
    }
    for (let j = 0; j < modulePermissions.length; j++) {
      PermissionModuleList.push(modulePermissions[j].itemName)
      permissionAyyay.push({
        itemName: modulePermissions[j].itemName,
        add: modulePermissions[j].add,
        delete: modulePermissions[j].delete,
        edit: modulePermissions[j].edit,
        export: modulePermissions[j].export,
        view: modulePermissions[j].view,
        level_permission: modulePermissions[j].level_permission
      })
      if (modulePermissions[j].sub_menu_permissions.length > 0) {
        for (let k = 0; k < modulePermissions[j].sub_menu_permissions.length; k++) {
          PermissionModuleList.push(modulePermissions[j].sub_menu_permissions[k].itemName)
          permissionAyyay.push({
            itemName: modulePermissions[j].sub_menu_permissions[k].itemName,
            add: modulePermissions[j].sub_menu_permissions[k].add,
            delete: modulePermissions[j].sub_menu_permissions[k].delete,
            edit: modulePermissions[j].sub_menu_permissions[k].edit,
            view: modulePermissions[j].sub_menu_permissions[k].view,
            export: modulePermissions[j].sub_menu_permissions[k].export,
            level_permission: modulePermissions[j].sub_menu_permissions[k].level_permission
          })
        }
      }
    }
    this.datasharedservice.saveLocalData('moduleList', JSON.stringify(PermissionModuleList))
    this.datasharedservice.saveLocalData('modulePermissions', JSON.stringify(permissionAyyay))
  }

  // filterSetting(data: any) {
  //   for (let i = 0; i < this.ModulePermissionArray.length; i++) {
  //     for (let j = 0; j < data.length; j++) {
  //       if (this.ModulePermissionArray[i] == data[j].itemName) {
  //         this.ModulePermissions.push({
  //           itemName: data[j].itemName,
  //           add: data[j].add,
  //           delete: data[j].delete,
  //           edit: data[j].edit,
  //           export: data[j].export,
  //           view: data[j].view,
  //           level_permission: data[j].level_permission
  //         })
  //       }
  //     }
  //   }
  //   this.datasharedservice.saveLocalData('modulePermissions', JSON.stringify(this.ModulePermissions))
  //   return true;
  // }

  // filterAccess(data: any) {
  //   for (let i = 0; i < this.ModulePermissionArray.length; i++) {
  //     for (let j = 0; j < data.length; j++) {
  //       if (data[j].itemName == this.ModulePermissionArray[i]) {
  //         this.ModulePermissions.push(
  //           {
  //             itemName: data[j].itemName,
  //             add: data[j].add,
  //             delete: data[j].delete,
  //             edit: data[j].edit,
  //             export: data[j].export,
  //             view: data[j].view,
  //             level_permission: data[j].level_permission
  //           }
  //         )
  //       }
  //       if (data[j].sub_menu_permissions.length > 0) {
  //         for (let k = 0; k < data[j].sub_menu_permissions.length; k++) {
  //           if (data[j].sub_menu_permissions[k].itemName == this.ModulePermissionArray[i]) {
  //             this.ModulePermissions.push(
  //               {
  //                 itemName: data[j].sub_menu_permissions[k].itemName,
  //                 add: data[j].sub_menu_permissions[k].add,
  //                 delete: data[j].sub_menu_permissions[k].delete,
  //                 edit: data[j].sub_menu_permissions[k].edit,
  //                 view: data[j].sub_menu_permissions[k].view,
  //                 export: data[j].sub_menu_permissions[k].export,
  //                 level_permission: data[j].sub_menu_permissions[k].level_permission
  //               }
  //             )
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return true;
  // }

  filterAdministrative(data: any) {
    for (let i = 0; i < this.AdMiniStrativePermissionArray.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (this.AdMiniStrativePermissionArray[i] == data[j].itemName) {
          this.AdminPermissions.push({
            itemName: data[j].itemName,
            has_approval_permission: data[j].has_approval_permission,
            has_approval_submit_permission: data[j].has_approval_submit_permission,
            has_export_permission: data[j].has_export_permission,
            has_import_permission: data[j].has_import_permission,
            level_permission: data[j].level_permission
          })
        }
      }
    }
    return true
  }
  permissionData : any = {}
  getModulePermissions(noduleName: string) {
    
    if(noduleName in this.permissionData){
      return this.permissionData[noduleName]
    } else {

      this.ModulePermissionArray = JSON.parse(this.datasharedservice.getLocalData('moduleList'))
      let position = this.ModulePermissionArray.indexOf(noduleName)

      if (position < 0) {
        this.permissionData[noduleName] = {
          level_permission : false,
          add : false,
          delete : false,
          edit : false,
          export : false,
          itemName : noduleName,
          view : false
        }
      } else {
        this.permissionData[noduleName] = JSON.parse(this.datasharedservice.getLocalData('modulePermissions'))[position]
      }      
      return this.permissionData[noduleName]
    }
  }

  getModulePermissionsMultiple(data:any) {
    for(let i=0;i<data.length;i++) {
      if(this.getModulePermissions(data[i]).level_permission) {
        return true
      }
    }
    return false
  }

}
