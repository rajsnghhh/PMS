import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-project-user-management',
  templateUrl: './project-user-management.component.html',
  styleUrls: [
    './project-user-management.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class ProjectUserManagementComponent implements OnInit {
  projectId:any
  siteList:any = []
  userList:any = []
  siteUser:any = []
  storeUser:any = []
  form = {
    projecthead : '',
    planninghead : '',
    siteUser : [],
    storeUser : []
  }
  disableFrom = false
  projectStoreList:any
  closePlanning() {}
  closeUserSetting () {}

  localStorageData : any

  constructor(
    private commonFunction : CommonFunctionService,
    private datasharedservice : DataSharedService,
    private apiservice : APIService,
    private activeroute : ActivatedRoute,
    private toastrService : ToastrService
  ) {}

  ngOnInit(): void {
    this.projectId = this.activeroute.snapshot.paramMap.get('projectId')
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPrefildData()
    this.getSiteList()
    this.getUserList()
  }

  getPrefildData() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: this.projectId,
      }
    )
    this.apiservice.getProjectData(query).subscribe(data => {
      if(data.project_head_details && data.project_head_details.length >0) {
        this.form.projecthead = data.project_head_details[0].id
      }
      if(data.planning_head_details && data.planning_head_details.length >0) {
        this.form.planninghead = data.planning_head_details[0].id
      }
    })
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.projectId);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
      for(let j=0;j<this.siteList.length;j++) {
        this.siteList[j].storeList = []
      }
      this.getProjeDependentStoreData()
    })
  }

  getProjeDependentStoreData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site__project', this.projectId);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.projectStoreList = data.results;
      for(let i=0;i<this.projectStoreList.length;i++) {
        for(let j=0;j<this.siteList.length;j++) {
          if(this.siteList[j].id == this.projectStoreList[i].id) {
            this.siteList[j].storeList.push(this.projectStoreList[i])
          }
        }
      }      
    })
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
      this.generateUserList()
    })
  }

  generateUserList() {
    this.siteUser = []
    this.storeUser = []

    for(let i=0;i<this.userList.length;i++) {
      let rolesArray:any = []
      for(let k=0;k<this.userList[i].permission_list.length;k++) {
        rolesArray.push(this.userList[i].permission_list[k].module_item__unique_id)
      }
      if (rolesArray.includes('procurement-site-editor') || rolesArray.includes('procurement-site-viewer')) {
        this.siteUser.push(this.userList[i])
      }
      if (rolesArray.includes('procurement-store-viewer') || rolesArray.includes('procurement-store-editor')) {
        this.storeUser.push(this.userList[i])
      }
    }
  }

  onSubmit() {
    this.toastrService.error("Development in progress !", '', {
      timeOut: 2000,
    });
  }
}
