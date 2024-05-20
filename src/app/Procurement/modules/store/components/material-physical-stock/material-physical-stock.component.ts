import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import {Success_Messages } from 'src/app/Shared/Config/config.const';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-physical-stock',
  templateUrl: './material-physical-stock.component.html',
  styleUrls: ['./material-physical-stock.component.scss',
  '../../../../../../assets/scss/scrollableTable.scss',
  '../../../../../../assets/scss/tableactionButton.scss']
})
export class MaterialPhysicalStockComponent implements OnInit {
  localStorageData: any;
  selectItemGroup:any;
  allItemGroup:any=[]
  addUser: any = {
    itemgroup: '',
    item: '',
    createDate:(new Date()).toISOString().substring(0,10),
    location:''
  }
  materialList:any;

  inventoryList: any = [ ];
  isPhysical_Stock_Approver:boolean=false;

  openCoverages = false;
  indexSelectedCoverage = 1;
  dropdownMultiselectGroupListSettings = {};
  dropdownMultiselectGroupList: any = [];
  dropdownMultiselectSiteListSettings = {};
  dropdownMultiselectSiteList: any = [];
  userArray: any = [];
  siteArray: any = [];
  siteList: any;
  groupList: any;
  locationList:any;
  physicalStockList:any=[];

  joined: any[] = [];

  maxDate:any=''
  mindate:any=''

  constructor(
    private router: Router,
    private apiservice: APIService,
    private toastrService:ToastrService,
    private datasharedservice: DataSharedService,
    private procurementApiService:PROCUREMENTAPIService
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.addUser.location=this.localStorageData.site_data.id;

    this.getGroupList();
    this.getItemMaterialList();
    this.setupMultiSelectOptions();
    this.setupMultiSelectOptions2();
    this.getSiteList();
    this.getUserDetails();
    this.onSearch();

    this.mindate = this.localStorageData.financial_year[0].start_date;
    this.maxDate = this.localStorageData.financial_year[0].end_date;
  }

  underTableClick(index:any){
    for(let i=0;i<this.joined.length;i++){
     this.joined[i].isExpanded=false;
       if(i==index){
         this.joined[index].isExpanded=true;
       }
    }
 }

  physicalStockEntry(event:any, joinedIndex:any, subsIndex: any){
    this.joined[joinedIndex].subs[subsIndex].phstockqty=event.target.value;
    this.joined[joinedIndex].subs[subsIndex].difqty= Number(this.joined[joinedIndex].subs[subsIndex].phstockqty) - Number(this.joined[joinedIndex].subs[subsIndex].quantity);
    this.joined[joinedIndex].subs[subsIndex].avgdifrate=this.joined[joinedIndex].subs[subsIndex].difqty * this.joined[joinedIndex].subs[subsIndex].cost_per_unit;
    this.joined[joinedIndex].subs[subsIndex].avgamount=this.joined[joinedIndex].subs[subsIndex].phstockqty * this.joined[joinedIndex].subs[subsIndex].cost_per_unit;
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.locationList = data.results;
    })
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions

      if (rolesArray.includes('procurement-physical-stock-approver')) {
        this.isPhysical_Stock_Approver = true
      }
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
    req.set('financialyear',this.localStorageData.financial_year[0].id);
    req.set('site',this.addUser.location);
    req.set('material__material_type__in',this.userArray.toString());
    req.set('material__in', this.siteArray.toString());
    req.set('all', 'true');

    this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
      this.inventoryList=data.results;

      const buildTreeObj = (arr: any) => {
        const obj: any = {};
        arr.forEach((item: any) => {
          if (obj[item.item_group]) {
            obj[item.item_group].subs.push(item);
          } else {
            obj[item.item_group] = {
              type: item.item_group,
              subs: item.item_sub_group ? [item] : [],
            };
          }
        });
        return Object.values(obj);
      };

      this.joined = buildTreeObj(this.inventoryList)

      this.joined.forEach((_covenants:any) => {
        _covenants.isExpanded = false;

        
          _covenants.subs.forEach((_items: any) => {
            _items.phstockqty = 0;
            _items.difqty = 0;
            _items.avgdifrate = 0;
            _items.avgamount = 0;
            _items.note = '';
          })
        
      });

    })
  }

  saveData(joinedIndex: any,subsIndex:any){
    
    let req={
    organization: this.localStorageData.organisation_details[0].id,
    inventory: this.joined[joinedIndex].subs[subsIndex].id,
    physical_qty: this.joined[joinedIndex].subs[subsIndex].phstockqty,
    actual_qty: this.joined[joinedIndex].subs[subsIndex].quantity,
    remarks: this.joined[joinedIndex].subs[subsIndex].note,
    material: this.joined[joinedIndex].subs[subsIndex].item_details[0][0].id,
    physical_rate:this.joined[joinedIndex].subs[subsIndex].cost_per_unit,
    actual_rate:this.joined[joinedIndex].subs[subsIndex].cost_per_unit,
    store:this.joined[joinedIndex].subs[subsIndex].store,
    site:this.joined[joinedIndex].subs[subsIndex].site,
    financialyear:this.localStorageData.financial_year[0]?.id
    }
    this.apiservice.addPhysicalStock(req).subscribe(data=>{
      this.toastrService.success(Success_Messages.SuccessAdd, '', {
        timeOut: 2000,
      });

      this.router.navigateByUrl('/pms/store/physical-stock-list');
    })
  }

  selectItemCoverages(index: number) {
    //this.openCoverages = this.openCoverages && this.indexSelectedCoverage === index ? false : true;
    //this.indexSelectedCoverage = index;
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
