import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-create-plant-prod-table',
  templateUrl: './create-plant-prod-table.component.html',
  styleUrls: ['./create-plant-prod-table.component.scss',
  '../../../../../../assets/scss/micro-view-table.scss',
  '../../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class CreatePlantProdTableComponent {
  localStorageData:any
  @Output() parentAction = new EventEmitter<any>();
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  @Input() prefieldData: any;
  @Input() scope: any;

  masterlist:any = []
  materialGroupList:any = []
  uomList:any = []
  disabledEdit = false;
  form:any = {
    plant_prod_table : false,
    items : []
  };

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService : PROCUREMENTAPIService,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getmasterList()
    this.getUomList()
    if(this.scope == 'add') {
      this.addItem()
    }
  }

  ngOnChanges(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if((this.scope == 'update' || this.scope == 'view') && this.prefieldData.id) {
      this.form.project = this.prefieldData.project
      this.form.site = this.prefieldData.site
      this.getmasterList1(this.prefieldData.items)
      // this.generatePrepopulateData(this.prefieldData.items)
      
    }
    if(this.scope == 'view') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }


  setDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm:any = today.getMonth() + 1; // Months start at 0!
    let dd:any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd
  }


  addItem() {
    this.form.items.push({
      "organization": this.localStorageData.organisation_details[0].id,
    })
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }


  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
      // this.generateMaterialData()
    })

    let preFilledItemGroupId = "";
    let preFilledSubItemGroupId = "";
    let preFilledItemId = "";

    let j = 0;
    for(let reqItem of this.form.items){
      this.typeChange(preFilledItemGroupId, j)
      this.subTypeChange(preFilledSubItemGroupId, j)
      j++
    }
  }
  getmasterList1(request:any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
      
      this.generatePrepopulateData(request)
      this.generateMaterialData()
    })
  }

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }

  generatePrepopulateData(datalist:any) {
    this.form.items = []
    
    for(let i=0;i<datalist.length;i++) {
      // === parent searching =======
      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('id', datalist[i].material_details[0].material_type_id);
      
      this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {
        let temp = {
          created_at: datalist[i].created_at,
          created_by: datalist[i].created_by,
          id: datalist[i].id,
          is_deleted: datalist[i].is_deleted,
          item: datalist[i].item,
          organization: datalist[i].organization,
          plant_production: datalist[i].plant_production,
          quantity: datalist[i].quantity,
          unit: datalist[i].unit,
          updated_at: datalist[i].updated_at,
          updated_by: datalist[i].updated_by,

          requested_material_group: data2.parent,
          requested_material_sub_group: datalist[i].material_details[0].material_type_id,
          requested_material : datalist[i].requested_material,
        }

        this.form.items.push(temp)
        let preFilledItemGroupId = data2.parent;

        let preFilledSubItemGroupId = datalist[i].material_details[0].material_type_id;
        let preFilledItemId = datalist[i].item;

        let j = 0;
        for(let reqItem of this.form.items){
          this.groupTypeChange(preFilledItemGroupId, j)
          this.subTypeChange(preFilledSubItemGroupId, j)
          j++
        }

        setTimeout(() => {
          this.setMaterialMasterData(i,true,datalist[i].item)
        }, 1000);

      })
      // === parent searching =======
    }
  }

  typeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.items[i].MaterilSubGroupList = data.results;
    })
  }

  groupTypeChange(typeid: any, i: any){
    this.form.items[i].MaterilSubGroupList = '';
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.items[i].MaterilSubGroupList = data.results;
    })
  }
  subTypeChange(typeid: any, i: any){
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.items[i].MaterilFilterList = data2.results;
     // this.setMaterialMasterData(i,true)
    })
    // ========= getting materials =========
  }

  setMaterialMasterData(index:number,autoPopulateScope:boolean,event:any) {

    if(this.form.items[index].MaterilFilterList){
      let findData = this.form.items[index].MaterilFilterList.filter((item: { id: any; }) => item.id == this.form.items[index].item)
      if(findData.length > 0) {
        this.form.items[index].MaterialmasterData = findData[0]
        this.getProcurementMaterialDetails(index,true)
      } else {
        this.form.items[index].MaterialmasterData = {}
      }
    }
    this.setUOM(event, index)

  }

  getProcurementMaterialDetails(index:any,autoPopulateScope:boolean) {
    if(this.datasharedservice.getLocalData('selectedProject') || this.form.project) {
      let params = new URLSearchParams();
      params.set('id', this.form.items[index].item);
      if(this.datasharedservice.getLocalData('selectedProject')) {
        params.set('project', this.datasharedservice.getLocalData('selectedProject'));
      }else {
        params.set('project', this.form.project);
      }
      this.procurementApiService.getProcurementMaterialDetails(params).subscribe(data => {
        this.form.items[index].MaterialBOQ = data.Data

        this.form.items[index].total_received_uptodate = (data.results[0]?.total_recieved_quantity) ? (data.results[0]?.total_recieved_quantity) : 0
        this.form.items[index].budgeted_qty = (data.results[0]?.total_project_quantity) ? (data.results[0]?.total_project_quantity) : 0
        this.form.items[index].currentStock = (data.results[0]?.total_balance_quantity)? (data.results[0]?.total_balance_quantity) : 0
        
      })
      this.form.items[index].currentStock = '0'

      let req = new URLSearchParams();
      req.set('organization_id', this.localStorageData.organisation_details[0].id);
      if(this.datasharedservice.getLocalData('selectedSite')) {
        req.set('site', this.datasharedservice.getLocalData('selectedSite'));
      }else {
        req.set('site', this.form.site);
      }
      req.set('material', this.form.items[index].item);

      this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
            
        this.form.items[index].stock_on_site = (data.results[0]?.quantity)? (data.results[0]?.quantity) : 0
        
      })
      
    }else {
      this.toastrService.error('Project not selected yet!', '', {
        timeOut: 2000,
      });
    }
  }

  setUOM(event: any, index: any) {

    if (this.form.items[index].MaterilFilterList) {
      const selectedItemId = event;

      const selectedMasterData = this.form.items[index].MaterilFilterList.find((item: any) => item.id === parseInt(selectedItemId));
      if (selectedMasterData) {
        this.unitDropdownData(selectedMasterData, index);
        this.form.items[index].uom = selectedMasterData.unit_of_mesurement;
      }
    }

  }

  unitDropdownData(data: any, ind: any) {
    let uomarray: any = []
    uomarray.push(data.unit_of_mesurement);
    if (data.second_unit_of_mesurement.length > 0) {
      data.second_unit_of_mesurement.forEach((element: any) => {
        uomarray.push(Number(element.second_uom));
      });
    }
    this.form.items[ind].uomlistData = this.uomList.filter((item: any) => uomarray.includes(item.id));

  }

  checkFromStock(i: any){
    if(this.form.items[i].quantity > this.form.items[i].currentStock){
      this.form.items[i].quantity = 0
    }
  }


  delete(index:any) {
    this.form.items.splice(index, 1);
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit(): void {
    this.form.plant_prod_table = true
    JSON.stringify(this.form, null, 2)
    this.parentAction.emit(JSON.stringify(this.form, null, 2))
  }
}
