import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../purchase/data-sharing.service';

@Component({
  selector: 'app-grn-table-data',
  templateUrl: './grn-table-data.component.html',
  styleUrls: ['./grn-table-data.component.scss']
})
export class GrnTableDataComponent {
  localStorageData: any

  @Input() prefieldData: any;
  @Input() selectedPODetails: any;
  @Input() selectedIndentDetails: any;
  @Input() scope: any;
  @Output() parrentAction = new EventEmitter<any>();

  @ViewChild('submitButton', { read: ElementRef })

  submitButton!: ElementRef<HTMLElement>;
  masterlist: any = []
  materialGroupList: any = []
  uomList: any = []
  grnItems: any = []
  disabledEdit = true
  materialTypeList:any;

  form: any = {
    grn_table_data: false,
    grn_items: []
  };

  receivedData: any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private dataService: DataSharingService
  ) {

  }



  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.dataService.sharedData$.subscribe(data => {
      this.receivedData = data && data.sendProjectSite;
    });

    this.getmasterList()
    this.getUomList()
    this.getMaterialParent()

    this.form.grn_items.push({
      "organization": this.localStorageData.organisation_details[0].id,
      MaterialBOQ: [],
      currentStock: '',
      fill_item_by_party: false,
      is_royalty: false,
      is_warranty: false,
      is_istp: false
    })
  }

  ngOnChanges(changes: SimpleChanges): void {   
        
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    if(this.scope == 'add' && this.selectedPODetails != ''){
      this.form.site=this.selectedPODetails.site;
      this.form.project=this.selectedPODetails.project;

      this.getmasterList1(this.selectedPODetails)
    }
    
    if(this.scope == 'add' && this.selectedIndentDetails != ''){

      this.form.project = this.getGRNProject(this.selectedIndentDetails.results,'project_details')
      this.form.site = this.getGRNProject(this.selectedIndentDetails.results,'site_details')
      this.getmasterList1(this.selectedIndentDetails)
    }

    if((this.scope == 'update' || this.scope == 'view'  ) && this.prefieldData?.id) {

      this.form.project = this.prefieldData.project
      this.form.site = this.prefieldData.site
      this.form.status = this.prefieldData.status

      this.getmasterList1(this.prefieldData.grn_items)
    }
    if(this.scope == 'view') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }

  getGRNProject(data:any,tokenName:any) {
    let filter = data.filter(((item: { [x: string]: { id: any; }[]; }) => item[tokenName][0]?.id == data[0][tokenName][0]?.id))
    if(data.length == filter.length) {
      return data[0].project_details[0].id
    } else {
      return null
    }
  }

  getAllMaterialList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.masterlist = data.results
      if(this.form.grn_items.length > 0) {
        for(let i=0;i<this.form.grn_items.length;i++) {

          let filter = this.masterlist.filter((item: { id: any; }) => item.id == this.form.grn_items[i].requested_material)
          if(filter.length > 0) {
            this.form.grn_items[i].requested_material_group = filter[0].material_type_details[0].parent_id
            this.form.grn_items[i].requested_material_sub_group = filter[0].material_type_details[0].id
            this.setMaterialSubGroup(i, filter[0].material_type_details[0].parent_id)
            this.setMaterialList(i, filter[0].material_type_details[0].id)
          }
        }
      }
      
    })
  }

  
  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.masterlist = data.results;
      this.generateMaterialData()
      this.form.grn_items.forEach((x: any, index: any) => {
        this.filterMasterList(index)
        this.setMaterialMasterData(index)
      })
    })
  }
  getMaterialParent() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;
    })
  }
  getmasterList1(request:any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.masterlist = data.results
      
      this.generatePrepopulateData(request)
      this.generateMaterialData()
    })
  }


  setMaterialSubGroup(index: number,typeid:any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.grn_items[index].MaterilSubGroupList = data.results;      
    })
  }

  setMaterialList(i:any,subtypeId:any) {
      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('material_type', subtypeId);
      params2.set('page', '1');
      params2.set('page_size', '1000');
  
      this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
        this.form.grn_items[i].MaterilFilterList = data2.results;
      })
    }
  

  filterMasterList(index: number) {
    for (let i = 0; i < this.masterlist.length; i++) {
      if (this.masterlist[i].id == this.form.grn_items[index].requested_material) {
        this.form.grn_items[index].requested_material_group = this.masterlist[i].material_type_name
        this.setMaterialSubGroup(index,'')
        this.form.grn_items[index].requested_material_sub_group = this.masterlist[i].material_sub_type_name
        break;
      }
    }
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }

  onCheckfill_item_by_party(index: any) {
    if (this.form.grn_items[index].fill_item_by_party) {
      this.form.grn_items[index].fill_item_by_party = true;
    } else {
      this.form.grn_items[index].fill_item_by_party = false;
    }
  }

  setDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1;
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd
  }


  setMaterialMasterData(index: number) {
   
    for (let i = 0; i < this.masterlist.length; i++) {
      if (this.masterlist[i].id == this.form.grn_items[index].item) {
        this.form.grn_items[index].MaterialmasterData = this.masterlist[i]
        this.getProcurementMaterialDetails(index)
        break;
      }
    }
  }


  getProcurementMaterialDetails(index: any) {

    let params = new URLSearchParams();
    params.set('id', this.form.grn_items[index].item);
    params.set('project', this.receivedData?.projectId)

    if(this.receivedData?.projectId) {
      params.set('project', this.receivedData?.projectId);
    }else {
      params.set('project', this.form.project);
    }

    if(this.form.project || this.receivedData?.projectId){
      this.procurementApiService.getProcurementMaterialDetails(params).subscribe(data => {
        this.form.grn_items[index].MaterialBOQ = data.Data
  
        this.form.grn_items[index].total_received_uptodate = (data.results[0]?.total_recieved_quantity) ? (data.results[0]?.total_recieved_quantity) : 0      
        this.form.grn_items[index].budgeted_qty = (data.results[0]?.total_project_quantity) ? (data.results[0]?.total_project_quantity) : 0
        this.form.grn_items[index].currentStock = (data.results[0]?.total_balance_quantity)? (data.results[0]?.total_balance_quantity) : 0
        
      })
    }
   
    this.form.grn_items[index].currentStock = '0'

    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);

    if(this.receivedData?.siteId) {
      req.set('site', this.receivedData?.siteId);
    }else {
      req.set('site', this.form.site);
    }

    req.set('material', this.form.grn_items[index].item);

    if(this.receivedData?.siteId || this.form.site){
      this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {

        this.form.grn_items[index].stock_on_site = (data.results[0]?.quantity)? (data.results[0]?.quantity) : 0
        
      })
    }
  }


  addMoreGRNItems() {
    this.form.grn_items.push({
      "organization": this.localStorageData.organisation_details[0].id,
      MaterialBOQ: [],
      currentStock: '',
      fill_item_by_party: false,
      is_royalty: false,
      is_warranty: false,
      is_istp: false
    })
  }

  calculateShowAmount(index: number): void {
    const item = this.form.grn_items[index];
    item.show_amount = item.received_quantity * item.rate;
  }


  delete(index: any) {
    this.form.grn_items.splice(index, 1);
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }


  onSubmit(): void {
    this.form.grn_table_data = true
    JSON.stringify(this.form)
    this.parrentAction.emit(JSON.stringify(this.form))
  }

  generatePrepopulateData(datalist:any) {
    this.form.grn_items = []  
    
    if(datalist){
      if(datalist?.isFromPO == true){
        for(let i=0; i<datalist.items.length; i++) {
          let params2 = new URLSearchParams();
          params2.set('organization_id', this.localStorageData.organisation_details[0].id);
          params2.set('id', datalist.items[i].material_type_details[0].id);
          
          this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {
            let temp:any = datalist.items[i]

            temp.requested_material_group = data2.parent
            temp.requested_material_sub_group = datalist.items[i].material_type_details[0].id
            temp.show_amount = datalist.items[i].item_amount
          

            this.form.purchase_order = datalist.purchase_order
            this.form.grn_items.push(temp)
            let preFilledItemGroupId = data2.parent;
            let preFilledSubItemGroupId = datalist.items[i].material_type_details[0].id;
            let preFilledItemId = datalist.items[i].item;
    
            let j = 0;
            for(let reqItem of this.form.grn_items){
              this.setMaterialSubGroup(j,preFilledItemGroupId)
              this.setMaterialList(j,preFilledSubItemGroupId)
              j++
            }

            setTimeout(() => {
              this.getProcurementMaterialDetails(i)
            }, 1000);
           
          })
          
        }
      } else if(datalist?.isFromIndent == true){
        
        for(let i=0; i<datalist.results.length; i++) {
  
          let temp = {
            requested_material_group : datalist.results[i].material_details.material_type_details[0].parent_id,
            requested_material_sub_group : datalist.results[i].material_details.material_type,
            item : datalist.results[i].requested_material,
            received_quantity : datalist.results[i].quantity,
            received_weight : datalist.results[i].weight,
            rate : datalist.results[i].rate,
            show_amount : datalist.results[i].amount,
            indent_item : datalist.results[i].id,
            organization : datalist.results[i].organization,
          }
          this.form.grn_items.push(temp) 
          
          
          let j = 0;
          for(let reqItem of this.form.grn_items){
            let preFilledItemGroupId = reqItem.requested_material_group;
            let preFilledSubItemGroupId = reqItem.requested_material_sub_group;
            let preFilledItemId = reqItem.item;
            this.setMaterialSubGroup(j,preFilledItemGroupId)
            this.setMaterialList(j,preFilledSubItemGroupId)
            j++
          }
          setTimeout(() => {
            this.setMaterialMasterData(i)
          }, 1000);
        }
  
        
       

        
      } else {
        for(let i=0; i<datalist.length; i++) {
          let params2 = new URLSearchParams();
          params2.set('organization_id', this.localStorageData.organisation_details[0].id);
          params2.set('id', datalist[i].material_type_details[0].id);
          
          this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {
    
            let temp = {
              id : datalist[i].id,
              fill_item_by_party : datalist[i].fill_item_by_party,
              barcode : datalist[i].barcode,
              requested_material_group : data2.parent,
              requested_material_sub_group : datalist[i].material_type_details[0].id,
              item : datalist[i].material_details[0].id,
              
              ordered_item : datalist[i].ordered_item,
              change_reason : datalist[i].change_reason,
              is_royalty : datalist[i].is_royalty,
              is_warranty : datalist[i].is_warranty,
              is_istp : datalist[i].is_istp,
              po_pending_quantity : datalist[i].po_pending_quantity,
              challan_quantity : datalist[i].challan_quantity,
              received_quantity : datalist[i].received_quantity,
              received_weight : datalist[i].received_weight,
              return_quantity : datalist[i].return_quantity,
              rate : datalist[i].rate,
              show_amount : datalist[i].amount,
              organization : this.localStorageData.organisation_details[0].id,

              
            }
            this.form.grn_items.push(temp)    
            let preFilledItemGroupId = data2.parent;
            let preFilledSubItemGroupId = datalist[i].material_type_details[0].id;
            let preFilledItemId = datalist[i].material_details[0].id;
    
            let j = 0;
            for(let reqItem of this.form.grn_items){
              this.setMaterialSubGroup(j,preFilledItemGroupId)
              this.setMaterialList(j,preFilledSubItemGroupId)
              j++
            }
  
            setTimeout(() => {
              this.setMaterialMasterData(i)
            }, 1000);
  
          })
          
        }
      }
    }

   
  }
}


