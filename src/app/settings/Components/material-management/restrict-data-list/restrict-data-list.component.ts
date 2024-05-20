import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-restrict-data-list',
  templateUrl: './restrict-data-list.component.html',
  styleUrls: ['./restrict-data-list.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
    '../../../../../assets/scss/from-coomon.scss',

  ]
})
export class RestrictDataListComponent implements OnInit {

  localStorageData: any;
  restrictDataList:any;
  deleteCompanyId:any;

  addUser: any = {
    pageName: '',
    group:'',
    site:''
  }

  siteList: any;
  groupList: any;

  groupIdArray:any=[]
  siteIdArray:any=[]

  dropdownMultiselectGroupListSettings = {};
  dropdownMultiselectGroupList: any = [];
  dropdownMultiselectSiteListSettings = {};
  dropdownMultiselectSiteList: any = [];
  userArray: any = [];
  siteArray: any = [];

  constructor(
    private apiservice: APIService,
    private router: Router,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getRestrictGroupList();
    this.setupMultiSelectOptions();
    this.setupMultiSelectOptions2();

    this.getSiteList();
    this.getGroupList();
  }

  getRestrictGroupList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getRestrictDataList(params).subscribe(data => {
      this.restrictDataList = data.results;
    })
  }
  onSearch(){
    this.changeStructure(this.addUser);
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_name',this.addUser.pageName);
    params.set('item_group__in',this.groupIdArray);
    params.set('site__in', this.siteIdArray);

    this.apiservice.getRestrictDataList(params).subscribe(data => {
      this.restrictDataList = data.results;
    })
  }

  changeStructure(data:any){
    this.groupIdArray=[];
    this.siteIdArray=[];
    for(let group of data?.group){
       this.groupIdArray.push(group.id)
    }
    for(let site of data?.site){
      this.siteIdArray.push(site.id)
   }
  }

  

  deleteCompany(id: number) {
    this.deleteCompanyId = id;
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.deleteCompanyId);
    params.set('method', 'delete');
    this.apiservice.deleteRestrictGroup(params).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getRestrictGroupList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  getGroupList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.groupList = data.results;
      this.showMultiStateSelect();
    })
  }

  setupMultiSelectOptions() {
    this.dropdownMultiselectGroupListSettings = {
      singleSelection: false,
      text: "Select Group",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }

  showMultiStateSelect() {
    this.dropdownMultiselectGroupList = [];
    for (const item of this.groupList) {
      var obj = {
        id: item.id,
        itemName: item?.name
      }
      this.dropdownMultiselectGroupList.push(obj);
    }
  }

  onMultiSelectAddUser(item: any) {
    this.userArray.push(item.id)
  }
  OnMultiDeSelectAddUser(item: any) {
    const index: number = this.userArray.indexOf(item.id);
    if (index !== -1) {
      this.userArray.splice(index, 1);
    }
  }
  onMultiSelectAddUserAll(items: any) {
    this.userArray = [];
    for (const item of items) {
      this.userArray.push(item.id);
    }
  }
  onMultiDeSelectAddUserAll(items: any) {
    this.userArray = [];
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
      this.showMultiStateSelect2();
    })
  }

  setupMultiSelectOptions2() {
    this.dropdownMultiselectSiteListSettings = {
      singleSelection: false,
      text: "Select Site",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }

  showMultiStateSelect2() {
    this.dropdownMultiselectSiteList = [];
    for (const item of this.siteList) {
      var obj = {
        id: item.id,
        itemName: item?.site_name
      }
      this.dropdownMultiselectSiteList.push(obj);
    }
  }

  onMultiSelectAddUser2(item: any) {
    this.siteArray.push(item.id)
  }
  OnMultiDeSelectAddUser2(item: any) {
    const index: number = this.siteArray.indexOf(item.id);
    if (index !== -1) {
      this.siteArray.splice(index, 1);
    }
  }
  onMultiSelectAddUserAll2(items: any) {
    this.siteArray = [];
    for (const item of items) {
      this.siteArray.push(item.id);
    }
  }
  onMultiDeSelectAddUserAll2(items: any) {
    this.siteArray = [];
  }

}
