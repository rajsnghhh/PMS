import { Component, OnInit } from '@angular/core';
import { AccessPermissionService } from 'src/app/Shared/Services/access-permission.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-setting-details',
  templateUrl: './setting-details.component.html',
  styleUrls: ['./setting-details.component.scss',
    '../../../assets/scss/scrollableTable.scss']
})
export class SettingDetailsComponent implements OnInit {
  userData: any;
  settingsData: any;
  environment = environment;
  constructor(
    private apiservice: APIService,
    private commonFunction: CommonFunctionService,
    private datasharedservice: DataSharedService,
    private accessPermissionService: AccessPermissionService
  ) { }
  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSettingList()
  }
  getSettingList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
        settings_for: this.datasharedservice.getLocalData('activeProduct')
      }
    )
    this.apiservice.getSettingList(query).subscribe((data: any) => {
      this.settingsData = data;
    })
  }

  NavigateToSetting(navTarget: string, navName: string) {
    this.commonFunction.NavigateToSetting(navTarget,navName)
  }

  getPermissionchild(moduleName: string) {
    return this.accessPermissionService.getModulePermissions(moduleName).level_permission
  }

  generateList(data:any) {
    let list = []
    for(let i=0;i<data.length;i++) {
      list.push('Setting '+data[i].name)
    }
    return list
  }

  getMultiLablePermission(data:any) {
    return this.accessPermissionService.getModulePermissionsMultiple(data)
  }

}
