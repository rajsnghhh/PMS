import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: [
    './add-role.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})


export class AddRoleComponent implements OnInit {
  @Output()
  parentFun = new EventEmitter<string>();

  userData: any
  setPermissions = false;

  menuList: any
  administrativeMenuList: any;
  generalsettingsMenuList: any;
  ModulePermissionMenuLIST:any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.addrole.organization = this.userData.organisation_details[0].id
    this.permissionData[0].organization_id = this.userData.organisation_details[0].id
  }


  addrole = {
    role_name: '',
    description: '',
    is_active: true,
    permissions_added: false,
    organization: ''
  };

  permissionData: any = [{
    organization_id: '',
    id: '',
    menu_list: {},
    administrative_list: {},
    setting_list: {}
  }]

  onroleSubmit() {
    this.apiservice.addRole(this.addrole).subscribe(data => {
      if (data.request_status == 0) {
        this.toastrService.error(data.msg, '', {
          timeOut: 2000,
        });
      }
      data = data.results.Data
      this.permissionData[0].id = data.id;
      this.proceedtosetPermissions()
    }, err => {
      this.toastrService.error(err.error.detail, '', {
        timeOut: 2000,
      });
    })
  }

  onPermissionSubmit() {
    this.permissionData = this.sanitizePermissionData(this.permissionData)
    this.permissionData[0].module_list = this.ModulePermissionMenuLIST;
    this.apiservice.createPermissions(this.permissionData).subscribe(data => {
      this.parentFun.emit();
      this.setPermissions = false;
      this.addrole.role_name = '',
        this.addrole.description = ''
      this.toastrService.success("Permission Added Successfully", '', {
        timeOut: 2000,
      });
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  sanitizePermissionData(data: any) {
    let memuList = data[0].menu_list;
    for (let i = 0; i < memuList.length; i++) {
      if (memuList[i].sub_menu_list.length == 0) {
        if (memuList[i].view == false && memuList[i].add == false && memuList[i].edit == false && memuList[i].delete == false && memuList[i].export == false) {
          memuList[i].level_permission = false
        } else {
          memuList[i].level_permission = true
        }
      } else {
        let submemuList = memuList[i].sub_menu_list
        memuList[i].level_permission = false;
        for (let j = 0; j < submemuList.length; j++) {
          if (submemuList[j].view == true || submemuList[j].add == true || submemuList[j].edit == true || submemuList[j].delete == true || submemuList[j].export == true) {
            submemuList[j].level_permission = true
            memuList[i].level_permission = true
          } else {
            submemuList[j].level_permission = false
          }
        }
        memuList[i].sub_menu_list = submemuList;
      }
    }
    this.permissionData[0].menu_list = memuList;
    return data;
  }

  getMenuList() {
    this.apiservice.getpermissionMenuLIST().subscribe(data => {
      this.menuList = data;
      this.generateMenuList(this.menuList.results)
    }, err => {
      this.toastrService.error(err.error.detail, '', {
        timeOut: 2000,
      });
    })
  }

  getAdministrativeList() {
    this.apiservice.getAdministrativMenuLIST().subscribe(data => {
      this.administrativeMenuList = data;
      this.getAdministrativeMenuList(this.administrativeMenuList)
    }, err => {
      this.toastrService.error(err.error.detail, '', {
        timeOut: 2000,
      });
    })
  }

  getGeneralSettingsList() {
    this.apiservice.getSettingsMenuLIST().subscribe(data => {
      this.generalsettingsMenuList = data;
      this.getSettingsMenuList(this.generalsettingsMenuList)
    }, err => {
      this.toastrService.error(err.error.detail, '', {
        timeOut: 2000,
      });
    })
  }

  getModulePermissionMenuLIST() {
    this.apiservice.getModulePermissionMenuLIST().subscribe(data => {
      this.ModulePermissionMenuLIST = []
      for(let i=0;i<data.length;i++) {
        this.ModulePermissionMenuLIST.push({
          level_permission:false,
          id:data[i].id,
          name:data[i].name,
          permission_for:data[i].permission_for,
          unique_id:data[i].unique_id
        })
      }
    }, err => {
      this.toastrService.error(err.error.detail, '', {
        timeOut: 2000,
      });
    })
  }
  toggleMenuList(index:any){
    this.ModulePermissionMenuLIST[index].level_permission = !this.ModulePermissionMenuLIST[index].level_permission
    if(this.ModulePermissionMenuLIST[index].level_permission) {
      for(let i=0;i<this.permissionData[0].menu_list.length;i++) {
        if(this.ModulePermissionMenuLIST[index].permission_for == this.permissionData[0].menu_list[i].menu_name) {
          this.permissionData[0].menu_list[i].level_permission = true;
          this.permissionData[0].menu_list[i].view = true;
          this.permissionData[0].menu_list[i].add = true;
          break;
        }
      }
    }
  }

  generateMenuList(data: any) {
    let resarray = []
    for (let i = 0; i < data.length; i++) {
      let temparray = []
      if (data[i].sub_menu_details.length > 0) {
        for (let j = 0; j < data[i].sub_menu_details.length; j++) {
          temparray.push({
            "id": data[i].sub_menu_details[j].id,
            "menu_name": data[i].sub_menu_details[j].sub_menu_name,
            "view": false,
            "add": false,
            "edit": false,
            "delete": false,
            "export": false,
            "level_permission": false,
          })
        }
      }
      resarray.push({
        "id": data[i].id,
        "menu_name": data[i].menu_name,
        "view": false,
        "add": false,
        "edit": false,
        "delete": false,
        "export": false,
        "sub_menu_list": temparray,
        "level_permission": false,
      })
    }
    this.permissionData[0].menu_list = resarray
  }

  getAdministrativeMenuList(data: any) {
    let resarray = []
    for (let i = 0; i < data.length; i++) {
      resarray.push({
        "id": data[i].id,
        "view": false,
        "import": false,
        "approval": false,
        "approval_submit": false,
        "export": false,
        "level_permission": false,
      })
    }
    this.permissionData[0].administrative_list = resarray
  }

  getSettingsMenuList(data: any) {
    let resarray = []
    for (let i = 0; i < data.length; i++) {
      resarray.push({
        "id": data[i].id,
        "menu_name": data[i].menu_name,
        "view": false,
        "add": false,
        "edit": false,
        "delete": false,
        "export": false,
        "level_permission": false,
      })
    }
    this.permissionData[0].setting_list = resarray
  }

  toggleMainMenu(menuid: number) {
    this.permissionData[0].menu_list[menuid].level_permission = !this.permissionData[0].menu_list[menuid].level_permission
    if (this.permissionData[0].menu_list[menuid].level_permission == false) {

      this.permissionData[0].menu_list[menuid].view = false;
      this.permissionData[0].menu_list[menuid].add = false;
      this.permissionData[0].menu_list[menuid].edit = false;
      this.permissionData[0].menu_list[menuid].delete = false;
      this.permissionData[0].menu_list[menuid].export = false;

      if (this.permissionData[0].menu_list[menuid].sub_menu_list.length > 0) {

        for (let j = 0; j < this.permissionData[0].menu_list[menuid].sub_menu_list.length; j++) {
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].view = false;
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].add = false;
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].edit = false;
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].delete = false;
          this.permissionData[0].menu_list[menuid].sub_menu_list[j].export = false;
        }
      }
    }
  }

  togglechildMainMenu(i: number, j: number) {
    this.permissionData[0].menu_list[i].sub_menu_list[j].level_permission = !this.permissionData[0].menu_list[i].sub_menu_list[j].level_permission;
  }

  admintoggleMainMenu(menuid: number) {
    this.permissionData[0].administrative_list[menuid].level_permission = !this.permissionData[0].administrative_list[menuid].level_permission
    if (this.permissionData[0].administrative_list[menuid].level_permission == false) {
      this.permissionData[0].administrative_list[menuid].approval = false;
      this.permissionData[0].administrative_list[menuid].approval_submit = false;
      this.permissionData[0].administrative_list[menuid].export = false;
      this.permissionData[0].administrative_list[menuid].import = false;
      this.permissionData[0].administrative_list[menuid].view = false;
    }
  }

  settingsMenu(menuid: number) {
    this.permissionData[0].setting_list[menuid].level_permission = !this.permissionData[0].setting_list[menuid].level_permission
    if (this.permissionData[0].setting_list[menuid].level_permission == false) {
      this.permissionData[0].setting_list[menuid].approval = false;
      this.permissionData[0].setting_list[menuid].approval_submit = false;
      this.permissionData[0].setting_list[menuid].export = false;
      this.permissionData[0].setting_list[menuid].import = false;
      this.permissionData[0].setting_list[menuid].view = false;
    }
  }

  proceedtosetPermissions() {
    this.getMenuList()
    this.getAdministrativeList()
    this.getGeneralSettingsList()
    this.getModulePermissionMenuLIST()
    this.setPermissions = true;
  }

  resetADD(form: NgForm): void {
    this.setPermissions = false;
    this.parentFun.emit();
    this.addrole.role_name = ''
    this.addrole.description = ''
    // form.reset();
  }

  valuechange() {
    // this.permissionData = this.sanitizePermissionData(this.permissionData)
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


}


