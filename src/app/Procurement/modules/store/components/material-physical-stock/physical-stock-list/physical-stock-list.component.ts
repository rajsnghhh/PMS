import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-physical-stock-list',
  templateUrl: './physical-stock-list.component.html',
  styleUrls: ['./physical-stock-list.component.scss',
  '../../../../../../../assets/scss/scrollableTable.scss',
  '../../../../../../../assets/scss/tableactionButton.scss']
})
export class PhysicalStockListComponent implements OnInit {

  localStorageData: any;
  selectItemGroup:any;
  allItemGroup:any=[]
  addUser: any = {
    itemgroup: '',
    item: '',
    fromDate:'',
    toDate:'',
    location:''
  }
  materialList:any;
  dropdownMultiselectGroupListSettings = {};
  dropdownMultiselectGroupList: any = [];
  dropdownMultiselectSiteListSettings = {};
  dropdownMultiselectSiteList: any = [];
  userArray: any = [];
  siteArray: any = [];
  physicalStockList:any=[];
  siteList: any;
  groupList: any;
  locationList:any;

  constructor(
    private apiservice: APIService,
    private toastrService:ToastrService,
    private datasharedservice: DataSharedService,
    private procurementApiService:PROCUREMENTAPIService
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.addUser.location=this.localStorageData.site_data.id;
    this.getGroupList();
    this.getPhysicalStock();
    this.getItemMaterialList();
    this.setupMultiSelectOptions();
    this.setupMultiSelectOptions2();
    this.getSiteList();
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.locationList = data.results;
    })
  }

  getPhysicalStock(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getProcurementPhysicalStock(params).subscribe(data => {
       this.physicalStockList=data.results;
    })
  }

  onSearch(){    
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    req.set('financialyear__start_date__lte',this.addUser.fromDate);
    req.set('financialyear__end_date__gte',this.addUser.toDate);
    req.set('inventory__store',this.addUser.location);
    req.set('inventory__site',this.addUser.location);
    req.set('material__material_type__in',this.userArray.toString());
    req.set('material__in', this.siteArray.toString());

    this.apiservice.getProcurementPhysicalStock(req).subscribe(data => {
      this.physicalStockList=data.results;
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

  getItemMaterialList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.siteList = data.results;
      this.showMultiStateSelect2();
    })
  }

  setupMultiSelectOptions2() {
    this.dropdownMultiselectSiteListSettings = {
      singleSelection: false,
      text: "Select Item",
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
        itemName: item?.material_name
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
