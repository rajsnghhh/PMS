import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-item-add-edit',
  templateUrl: './item-add-edit.component.html',
  styleUrls: [
    './item-add-edit.component.scss',
    '../../../../../../../assets/scss/from-coomon.scss'
  ]
})
export class ItemAddEditComponent implements OnInit,OnChanges{

  @Input()
  canvasScope!: any;

  @Input()
  selectedID!: any;

  @Output() closeCanvas = new EventEmitter<string>();

  constructor(
    private apiservice : APIService,
    private procurementApiService : PROCUREMENTAPIService,
    private datasharedservice : DataSharedService,
    private toastrService: ToastrService,

  ) {}

  materialList :any = []
  MaterilFilterList :any = []
  localStorageData :any
  materialGroupList : any = []
  MaterilSubGroupList : any = []
  seleceableMaterialList : any = []
  projectSiteList:any = []
  projectStoreList:any = []

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjeDependentSiteData()
    this.getmasterList()
    this.getUOMData()
    this.addPersonalInformation.site=this.localStorageData.site_data.id
    this.getStoreList()
  }

  uomList :  any = []
  getUOMData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if((this.canvasScope == 'view' || this.canvasScope == 'update') && this.selectedID) {
      this.generatePrePopulateData()
    }
  }

  generatePrePopulateData() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    req.set('id', this.selectedID);

    this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
      this.getmasterList1(data);

      // === parent searching =======
      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('id', data.item_details[0][0].material_type_id);
      
      this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {

        this.addPersonalInformation.cost_per_unit = data.cost_per_unit
        this.addPersonalInformation.id = data.id
        this.addPersonalInformation.group = data2.parent
        this.addPersonalInformation.subgroup = data.item_details[0][0].material_type_id
        this.addPersonalInformation.material = data.material
        this.addPersonalInformation.opening_quantity = data.opening_quantity
        this.addPersonalInformation.quantity = data.quantity
        this.addPersonalInformation.opening_weight = data.opening_weight
        
        this.addPersonalInformation.remarks = data.remarks
  
        this.addPersonalInformation.site = data.site_disp
        this.addPersonalInformation.store = data.store
        
        this.addPersonalInformation.uom_opening_qty = data.uom_opening_qty
        this.addPersonalInformation.uom_opening_weight = data.uom_opening_weight
        this.addPersonalInformation.uom_opening_cost_per_unit = data.uom_opening_cost_per_unit
        this.addPersonalInformation.financialyear = data.financialyear
  
        this.addPersonalInformation.stock_type = data.stock_type
        this.changeItem()
        this.getStoreList()
        // this.setMaterialSubGroup()
        // this.setMaterialList()
        // this.selectMaterial()
        this.calculateItemAmount()

      })

    })
  }


  avliableUom:any = []
  changeItem() {
    let filter =  this.MaterilFilterList.filter((item: { id: any; }) => item.id == this.addPersonalInformation.material)
    if(filter.length > 0) {
      this.addPersonalInformation.item_uom = filter[0].unit_of_mesurement_name
      this.avliableUom = []
      this.avliableUom.push(parseInt(filter[0].unit_of_mesurement))
      for(let i=0;i<filter[0].second_uom.length;i++) {
        this.avliableUom.push(parseInt(filter[0].second_uom[i].second_uom))
      }
    }
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialGroupList = data.results
    })

    let preFilledItemGroupId = "";
    let preFilledSubItemGroupId = "";
    let preFilledItemId = "";

    this.typeChange(preFilledItemGroupId)
    this.subTypeChange(preFilledSubItemGroupId)
    // let j = 0;
    // for(let reqItem of this.form.requested_items){
    //   j++
    // }
  }
  getmasterList1(request:any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialGroupList = data.results
      
      // this.generatePrepopulateData(request)
      // this.generateMaterialData()
    })
  }

  typeChange(typeid: any) {
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.MaterilSubGroupList = data.results;
    })
  }
  groupTypeChange(typeid: any){
    this.MaterilSubGroupList = '';
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.MaterilSubGroupList = data.results;
    })
  }
  subTypeChange(typeid: any){
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.MaterilFilterList = data2.results;
    })
    // ========= getting materials =========
  }

  calculateItemAmount() {
    if(this.addPersonalInformation.cost_per_unit && this.addPersonalInformation.opening_quantity) {
      this.addPersonalInformation.item_Amount = this.addPersonalInformation.cost_per_unit * this.addPersonalInformation.opening_quantity
    }
  }

  getProjeDependentSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.projectSiteList = data.results;
    })
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site', this.addPersonalInformation.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.projectStoreList = data.results;
    })
  }
  
  addPersonalInformation : any = {}
  personalSubmit() {

    let params = new URLSearchParams();
    this.addPersonalInformation["organization"] = this.localStorageData.organisation_details[0].id

    // if(!this.addPersonalInformation.store){
    //   this.addPersonalInformation.store = null
    // } else {
    //   this.addPersonalInformation.site = null
    // }

    if(this.addPersonalInformation.id) {
      let request = {
        organization: this.localStorageData.organisation_details[0].id,
        material: this.addPersonalInformation.material,
        store: this.addPersonalInformation.store,
        site: this.addPersonalInformation.site,
        opening_quantity: this.addPersonalInformation.opening_quantity,
        opening_weight: this.addPersonalInformation.opening_weight ? this.addPersonalInformation.opening_weight : 0,
        cost_per_unit: this.addPersonalInformation.cost_per_unit,
        remarks: this.addPersonalInformation.remarks,
        uom_opening_qty: this.addPersonalInformation.uom_opening_qty,
        uom_opening_weight: this.addPersonalInformation.uom_opening_weight,
        uom_opening_cost_per_unit: this.addPersonalInformation.uom_opening_cost_per_unit,
        financialyear : this.addPersonalInformation.financialyear
      }

      params.set('id', this.selectedID);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      this.procurementApiService.updateInventory(params,request).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
        this.addPersonalInformation = {}
      })
    }else {
      let request = {
        organization: this.localStorageData.organisation_details[0].id,
        material: this.addPersonalInformation.material,
        store: this.addPersonalInformation.store,
        site: this.addPersonalInformation.site,
        opening_quantity: this.addPersonalInformation.opening_quantity,
        opening_weight: this.addPersonalInformation.opening_weight ? this.addPersonalInformation.opening_weight : 0,
        cost_per_unit: this.addPersonalInformation.cost_per_unit,
        remarks: this.addPersonalInformation.remarks,
        uom_opening_qty: this.addPersonalInformation.uom_opening_qty,
        uom_opening_weight: this.addPersonalInformation.uom_opening_weight,
        uom_opening_cost_per_unit: this.addPersonalInformation.uom_opening_cost_per_unit,
        financialyear:this.localStorageData.financial_year[0].id
      }

      this.procurementApiService.addInventory(params,request).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.CloseComponent()
        this.addPersonalInformation = {}
      })
    }
  }

  CloseComponent() {
    this.closeCanvas.emit()
  }

}
