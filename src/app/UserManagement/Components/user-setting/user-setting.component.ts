import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: [
  './user-setting.component.scss',
  '../../../../assets/scss/from-coomon.scss']
})
export class UserSettingComponent implements OnInit {

  @Output()
  parentFun = new EventEmitter<string>();

  menuList:any
  administrativeMenuList:any

  dropdownList:any;
  selectedItems:any;
  dropdownSettings = {};
  userData:any;
  

  permissionData:any = [{
    organization_id: '',
    id: '',
    user_id:'',
    menu_list: {},
    administrative_list: {}    
  }]
  showPermissions = false;
  invalidName = false; 
  constructor(
    private apiservice:APIService,
    private toastrService:ToastrService,
    private commonFunction:CommonFunctionService
  ) { }

  ngOnInit(): void {
  }

  getuserSettingData(id:string,roleId:any,organization_id:string) {
    this.getUserDetails(id,roleId,organization_id);
  }
  
  getUserDetails(id:string,roleId:any,organization_id:string){
    this.permissionData[0].organization_id = organization_id;
    this.permissionData[0].user_id = id;
    this.permissionData[0].id = roleId;

   let queryParaMap = {
      page_size: 10,
      page: 1,
      organisation:organization_id,
      id:id
    }
    
    let query = this.commonFunction.getURL(queryParaMap)
    this.apiservice.getUserList(query).subscribe(data => {
      this.userData=data.results[0].role_details;
      this.getAdministrativeMenuList(data.results[0].role_details.user_administrative_permissions) ; 
      this.generateMenuList(data.results[0].role_details.user_permissions_details);
      this.getSettingsMenuList(data.results[0].role_details.user_setting_permission);
      this.permissionData[0].module_list = data.results[0].role_details.user_module_permission;
    })
  }

  close() {
    this.parentFun.emit();
  }

  toggleMenuList(index:any){
    this.permissionData[0].module_list[index].level_permission = !this.permissionData[0].module_list[index].level_permission
    if(this.permissionData[0].module_list[index].level_permission) {
      for(let i=0;i<this.permissionData[0].menu_list.length;i++) {
        if(this.permissionData[0].module_list[index].permission_for == this.permissionData[0].menu_list[i].itemName) {
          this.permissionData[0].menu_list[i].level_permission = true;
          this.permissionData[0].menu_list[i].view = true;
          this.permissionData[0].menu_list[i].add = true;
          break;
        }
      }
    }
  }

  oneditSubmit() {
      this.apiservice.updateUserPermissions(this.permissionData).subscribe(data=> {
        this.toastrService.success(data.msg, '', {
          timeOut: 2000,
        });
        this.close();
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      })
  }

  generateMenuList(data:any) {
    let resarray = []
    for(let i=0;i<data.length;i++) {
      let temparray = []
      if(data[i].sub_menu_permissions.length > 0){
        for(let j=0;j<data[i].sub_menu_permissions.length;j++){
          temparray.push({
            "id": data[i].sub_menu_permissions[j].sub_menu_id,
            "view": data[i].sub_menu_permissions[j].view,
            "add": data[i].sub_menu_permissions[j].add,
            "edit": data[i].sub_menu_permissions[j].edit,
            "delete": data[i].sub_menu_permissions[j].delete,
            "export": data[i].sub_menu_permissions[j].export,
            "sub_menu_id" : data[i].sub_menu_permissions[j].sub_menu_id,
            "itemName": data[i].sub_menu_permissions[j].itemName,
            "level_permission":data[i].sub_menu_permissions[j].level_permission,
          })
        }
      }
      
      resarray.push({
        "id": data[i].menu_id,
        "view": data[i].view,
        "add": data[i].add,
        "edit": data[i].edit,
        "delete": data[i].delete,
        "export": data[i].export,
        "itemName": data[i].itemName,
        "menu_id": data[i].menu_id,
        "sub_menu_list": temparray,
        "level_permission":data[i].level_permission,
      }) 
    }
    this.permissionData[0].menu_list = resarray
  }
  getSettingsMenuList(data: any) {
    let resarray = []
    for (let i = 0; i < data.length; i++) {
      resarray.push({
        "id": data[i].setting_item_id,
        "itemName": data[i].itemName,
        "view": data[i].view,
        "add": data[i].add,
        "edit": data[i].edit,
        "delete": data[i].delete,
        "export": data[i].export,
        "level_permission": data[i].level_permission,
      })
    }
    this.permissionData[0].setting_list = resarray;
    this.showPermissions = true;
  }
  getAdministrativeMenuList(data:any) {
    let resarray = []
    for(let i=0;i<data.length;i++) {
      resarray.push({
        "id": data[i].admin_item_id,
        "view": false,
        "import": data[i].has_import_permission,
        "name": data[i].itemName,
        "approval": data[i].has_approval_permission,
        "approval_submit": data[i].has_approval_submit_permission,
        "export": data[i].has_export_permission,
        "level_permission":data[i].level_permission,
      })
    }
    this.permissionData[0].administrative_list = resarray
  }

  settingsMenu(menuid: number) {
    this.permissionData[0].setting_list[menuid].level_permission = !this.permissionData[0].setting_list[menuid].level_permission
    if (this.permissionData[0].setting_list[menuid].level_permission == false) {
      this.permissionData[0].setting_list[menuid].add = false;
      this.permissionData[0].setting_list[menuid].edit = false;
      this.permissionData[0].setting_list[menuid].delete = false;
      this.permissionData[0].setting_list[menuid].export = false;
      this.permissionData[0].setting_list[menuid].view = false;
    }
  }

  valuechange() {
    this.permissionData[0].menu_list = this.sanitizePermissionlogic(this.permissionData[0].menu_list);
    this.permissionData[0].setting_list = this.sanitizeSettinglogic(this.permissionData[0].setting_list);
  }

  sanitizePermissionlogic(data: any) {
    setTimeout(function () {
      for (let i = 0; i < data.length; i++) {
        if (data[i].add || data[i].edit || data[i].delete || data[i].export) {
          data[i].view = true
        }
        if (data[i].sub_menu_list.length > 0) {
          for (let j = 0; j < data[i].sub_menu_list.length; j++) {
            if (data[i].sub_menu_list[j].add || data[i].sub_menu_list[j].edit || data[i].sub_menu_list[j].delete || data[i].sub_menu_list[j].export) {
              data[i].sub_menu_list[j].view = true
            }          
          }
        }
      }
    }, 20);
    return data
  }

  sanitizeSettinglogic(data: any) {
    setTimeout(function () {
      for (let i = 0; i < data.length; i++) {
        if (data[i].add || data[i].edit || data[i].delete || data[i].export) {
          data[i].view = true
        }
      }
    }, 20);
    return data
  }

  toggleMainMenu(menuid:number) {
    this.permissionData[0].menu_list[menuid].level_permission = !this.permissionData[0].menu_list[menuid].level_permission
    if(this.permissionData[0].menu_list[menuid].level_permission == false) {
      
      this.permissionData[0].menu_list[menuid].view = false;
      this.permissionData[0].menu_list[menuid].add = false;
      this.permissionData[0].menu_list[menuid].edit = false;
      this.permissionData[0].menu_list[menuid].delete = false;
      this.permissionData[0].menu_list[menuid].export = false;

      if(this.permissionData[0].menu_list[menuid].sub_menu_list.length > 0) {
        
        for(let j=0;j<this.permissionData[0].menu_list[menuid].sub_menu_list.length;j++){
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].view = false;
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].add = false;
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].edit = false;
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].delete = false;
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].export = false;
          // this.permissionData[0].menu_list[menuid].sub_menu_list[j].level_permission = false;
        }
      }
    }
  }

  togglechildMainMenu(i:number,j:number) {
    this.permissionData[0].menu_list[i].sub_menu_list[j].level_permission = !this.permissionData[0].menu_list[i].sub_menu_list[j].level_permission;
  }

  admintoggleMainMenu(menuid:number) {
    this.permissionData[0].administrative_list[menuid].level_permission = !this.permissionData[0].administrative_list[menuid].level_permission
    if(this.permissionData[0].administrative_list[menuid].level_permission == false) {
      this.permissionData[0].administrative_list[menuid].approval = false;
      this.permissionData[0].administrative_list[menuid].approval_submit = false;
      this.permissionData[0].administrative_list[menuid].export = false;
      this.permissionData[0].administrative_list[menuid].import = false;
      this.permissionData[0].administrative_list[menuid].view = false;
    }
  }
}
