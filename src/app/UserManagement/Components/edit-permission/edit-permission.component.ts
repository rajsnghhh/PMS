import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { APIService } from 'src/app/Shared/Services/api.service';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: [
    './edit-permission.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class EditPermissionComponent implements OnInit {
  @Output()
  parentFun = new EventEmitter<string>();

  @Output()
  getroleData = new EventEmitter<string>();

  generalsettingsMenuList: any
  menuList:any
  administrativeMenuList:any
  ModulePermissionMenuLIST:any
  dropdownList:any;
  selectedItems:any;
  dropdownSettings = {};
  userData:any;
  addrole = {
    role_name: '',
    description: '',
    is_active : true, 
    permissions_added : false, 
    organization: ''
  };

  permissionData:any = [{
    organization_id: '',
    id: '',
    menu_list: {},
    administrative_list: {},
    setting_list: {}
  }]
  showPermissions = false;
  invalidName = false; 

  constructor(
    private apiservice:APIService,
    private commonFunction:CommonFunctionService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {     
    this.setupMultiSelectOptions(); 
  }

  getEditData(id:string,organization_id:string) {
    this.getPermissionsDetails(id,organization_id);
  }

  ChangeName() {
    if(this.addrole.role_name != '') {
      this.invalidName = false
    }
  }
  

  getPermissionsDetails(id:string,organization_id:string) {
    this.permissionData[0].organization_id = organization_id;
    this.permissionData[0].id = id;
    let query = this.commonFunction.getURL(
      {
        id:id,
        organization_id: organization_id
      }
    )
    this.apiservice.getroleDetails(query).subscribe(data=> {
      this.userData = data
      this.addrole.role_name = data.role_name;
      this.addrole.description = data.description;
      this.ModulePermissionMenuLIST = data.user_module_permission;
      this.getAdministrativeMenuList(data.user_administrative_permissions)  
      this.generateMenuList(data.user_permissions_details) 
      this.getSettingsMenuList(data.user_setting_permission)
    }, err => {
      
    })
    
  }

  toggleMenuList(index:any) {
    this.ModulePermissionMenuLIST[index].level_permission = !this.ModulePermissionMenuLIST[index].level_permission
    if(this.ModulePermissionMenuLIST[index].level_permission) {
      for(let i=0;i<this.permissionData[0].menu_list.length;i++) {
        if(this.ModulePermissionMenuLIST[index].permission_for == this.permissionData[0].menu_list[i].itemName) {
          this.permissionData[0].menu_list[i].level_permission = true;
          this.permissionData[0].menu_list[i].view = true;
          this.permissionData[0].menu_list[i].add = true;
          break;
        }
      }
    }
  }

  setupMultiSelectOptions() {
    this.dropdownList = [
      {"id":1,"itemName":"Module Permission"},
      {"id":2,"itemName":"Setup Permission"},
      {"id":3,"itemName":"Administration"},
    ];

    this.selectedItems = [
      {"id":1,"itemName":"Module Permission"}
    ];
    this.dropdownSettings = { 
      singleSelection: false, 
      text:"Select Permissions",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"multi-select-dropdown"
    };
  }
  onItemSelect(item:any){
  }
  OnItemDeSelect(item:any){
  }
  onSelectAll(items: any){
  }
  onDeSelectAll(items: any){
  }

  close() {
    this.parentFun.emit();
  }

  oneditSubmit() {
    if(this.addrole.role_name != '') {
      this.invalidName = false
      this.permissionData[0].module_list = this.ModulePermissionMenuLIST;
      this.apiservice.updateRolePermissions(this.permissionData).subscribe(data=> {
        this.toastrService.success("Permission Updated Successfully", '', {
          timeOut: 2000,
        });
        setTimeout(function(){
          window.location.reload();
       }, 2000);
        }, err => {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
      })

      let query = this.commonFunction.getURL({
          method: 'edit',
          id: this.permissionData[0].id,
          organization_id: this.permissionData[0].organization_id
      });

      let queryData = {
        role_name: this.addrole.role_name,
        description: this.addrole.description,
        organization:this.permissionData[0].organization_id
      }
      
      this.apiservice.updateRoleName(query,queryData).subscribe(data=> {
        
      }, err => {
        
      })      
    } else {
      this.invalidName = true
    }
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
    this.showPermissions = true;
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
