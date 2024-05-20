import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-restrict-group',
  templateUrl: './restrict-group.component.html',
  styleUrls: ['./restrict-group.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class RestrictGroupComponent implements OnInit {

  restrictData: any = [];
  localStorageData: any;
  siteList: any;
  groupList: any;

  dropdownMultiselectGroupListSettings = {};
  dropdownMultiselectGroupList: any = [];
  dropdownMultiselectSiteListSettings = {};
  dropdownMultiselectSiteList: any = [];
  userArray: any = [];
  siteArray: any = [];

  finalRequestData: any = [];

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.restrictData.push({
      name: '',
      group: [],
      site: []
    });
    this.setupMultiSelectOptions();
    this.setupMultiSelectOptions2();

    this.getSiteList();
    this.getGroupList();
  }

  addRow() {
    this.restrictData.push({
      name: '',
      group: [],
      site: []
    });
  }

  deleteRow(index: any) {
    this.restrictData.splice(index, 1);
  }

  onSave() {
    this.changeStructure(this.restrictData);
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    let request = {
      data: this.finalRequestData
    }
    this.apiservice.addRestrictItem(params, request).subscribe(data => {
      this.toastrService.success("Restrict Item Group Created Successfully", '', {
        timeOut: 2000,
      });
      this.router.navigateByUrl('/pms/settings/restrict-group-list');
    })
  }

  changeStructure(data: any) {
    this.finalRequestData = [];
    for (let val of data) {

      var obj: any = {
        organization: this.localStorageData.organisation_details[0].id,
        page_name: val.name,
        item_group_ids: [],
        site_ids: []
      }

      for (let eachgroup of val.group) {
        obj.item_group_ids.push(eachgroup.id)
      }
      for (let eachsite of val.site) {
        obj.site_ids.push(eachsite.id)
      }
      this.finalRequestData.push(obj);
    }
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
