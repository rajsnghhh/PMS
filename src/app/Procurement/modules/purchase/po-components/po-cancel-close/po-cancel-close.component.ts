import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-po-cancel-close',
  templateUrl: './po-cancel-close.component.html',
  styleUrls: ['./po-cancel-close.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../assets/scss/tableactionButton.scss'
  ]
})
export class PoCancelCloseComponent {

  localStorageData: any;

  addUser: any = {
    group:'',
    site:'',
    vendor:'',
    from_date:(new Date()).toISOString().substring(0,10),
    to_date:(new Date()).toISOString().substring(0,10),
    grn_status:'',
    sanc_status:'',
    po_no:'',
    sanction_by:''
  }


  siteList: any;
  userlist: any;
  groupList: any;
  vendorList: any;
  purchaseOrderList: any = [];

  dropdownMultiselectGroupListSettings = {};
  dropdownMultiselectGroupList: any = [];
  dropdownMultiselectSiteListSettings = {};
  dropdownMultiselectSiteList: any = [];
  dropdownMultiselectVendorListSettings = {};
  dropdownMultiselectVendorList: any = [];
  userArray: any = [];
  siteArray: any = [];
  vendorArray: any = [];


  constructor(
    private apiservice: APIService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.setupMultiSelectOptions();
    this.setupMultiSelectOptions2();
    this.setupMultiSelectOptions3();

    this.getSiteList();
    this.getGroupList();
    this.getUserList();
    this.viewVendorList();
    this.getPurchaseOrderList();

    this.poCheckboxIdsForCancelClose = []
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userlist = data
    })
  }

  getPurchaseOrderList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('financialyear',this.localStorageData.financial_year[0].id)
    params.set('all', 'true')
    this.procurementAPIService.getQuotationList(params).subscribe(data => {
      this.purchaseOrderList = data.results;

      for(let i=0; i<this.purchaseOrderList.length; i++){
        this.purchaseOrderList[i].satusDate = ''
        this.purchaseOrderList[i].poItem = ''
        this.purchaseOrderList[i].changeStatus = ''
      }
      
    })
  }

  poCheckboxIdsForCancelClose :any = []
  onPOCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.poCheckboxIdsForCancelClose.push(itemId);
    } else {
      const index = this.poCheckboxIdsForCancelClose.indexOf(itemId);
      if (index !== -1) {
        this.poCheckboxIdsForCancelClose.splice(index, 1);
      }
    }
    
  }

  onSubmit(){
    let reqArr = []
    for(let val of this.poCheckboxIdsForCancelClose){
      var obj={
        id: val,
        status:this.purchaseOrderList.find((data:any)=> data.id==val).changeStatus,
        date:this.purchaseOrderList.find((data:any)=> data.id==val).satusDate
      }

      reqArr.push(obj)
    }
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('type', 'po');

    this.procurementAPIService.updateProcurementSatatus(params, reqArr).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });

      this.ngOnInit()
    })
  }

  onSearch() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('procurement_purchase_order_item__item__material_type__in', this.userArray.toString());
    params.set('site__in', this.siteArray.toString());
    params.set('vendor__in', this.vendorArray.toString());
    params.set('date__gte', this.addUser.from_date);
    params.set('date__lte', this.addUser.to_date);
    params.set('procurement_grn_purchase_orders__status', this.addUser.grn_status);
    params.set('status',this.addUser.sanc_status);
    params.set('request_code', this.addUser.po_no);
    params.set('updated_by', this.addUser.sanction_by);
    params.set('financialyear',this.localStorageData.financial_year[0].id)

    if(this.addUser.sanction_by){
      params.set('status__in','approved,close');
    }

    this.procurementAPIService.getQuotationList(params).subscribe(data => {
      this.purchaseOrderList = data.results;
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

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
      this.showMultiVendorSelect();
    })
  }
  setupMultiSelectOptions3() {
    this.dropdownMultiselectVendorListSettings = {
      singleSelection: false,
      text: "Select Vendor",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }

  showMultiVendorSelect() {
    this.dropdownMultiselectVendorList = [];
    for (const item of this.vendorList) {
      var obj = {
        id: item.id,
        itemName: item?.vendor_master_data.vendor_name
      }
      this.dropdownMultiselectVendorList.push(obj);
    }
  }

  onMultiSelectAddUser3(item: any) {
    this.vendorArray.push(item.id)
  }
  OnMultiDeSelectAddUser3(item: any) {
    const index: number = this.vendorArray.indexOf(item.id);
    if (index !== -1) {
      this.vendorArray.splice(index, 1);
    }
  }
  onMultiSelectAddUserAll3(items: any) {
    this.vendorArray = [];
    for (const item of items) {
      this.vendorArray.push(item.id);
    }
  }
  onMultiDeSelectAddUserAll3(items: any) {
    this.vendorArray = [];
  }


}
