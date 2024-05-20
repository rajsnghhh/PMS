import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-indent-request-form-table',
  templateUrl: './indent-request-form-table.component.html',
  styleUrls: ['./indent-request-form-table.component.scss']
})
export class IndentRequestFormTableComponent implements OnInit,OnChanges{
  localStorageData: any
  @Output() parrentAction = new EventEmitter<any>();
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  masterlist: any = []
  uomList: any
  materialGroupList: any = []
  @Input() selectedMRDetails: any;
  setSelectedMRDetails: Array<any> = [];
  @Input() isIndent_Approver: any;

  form: any = {};
  @Input() prefieldData: any;
  @Input() scope: any;
  disabledEdit = true
  editData: any = {}
  newAddScope = false
  materialTypeList:any;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    public router: Router,
    private toastrService: ToastrService,
    private procurementApiService: PROCUREMENTAPIService
  ) { 
    this.datasharedservice.getObservableData().subscribe(data => {
      if (data) {
        
        if(data?.store) {
          this.datasharedservice.saveLocalData('selectedStore',data.store)
        }
        if(data?.site) {
          this.datasharedservice.saveLocalData('selectedSite',data.site)
        }
        if(data?.project) {
          this.datasharedservice.saveLocalData('selectedProject',data.project)
        }
        if(data?.site) {
          this.datasharedservice.saveLocalData('selectedSite',data.site)
        }
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {

    if(this.scope == 'add' && this.selectedMRDetails.length>0) {
      this.ngOnInit()
    }

    // if(this.isIndent_Approver) {
    //   this.ngOnInit()
    // }

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.getAllMaterialList()

    if ((this.scope == 'update' || this.scope == 'view' || this.scope=='print') && this.prefieldData?.id) {
      this.form.status = this.prefieldData.status

      this.prefieldData?.indent_items.forEach((item: any) => {
        item.project_id = this.prefieldData.project;
        item.site_id = this.prefieldData.site
      });
      this.form.requested_items = this.prefieldData?.indent_items      
      this.form.requested_items.forEach((x:any, index: any) => {
        setTimeout(() => {
          this.setMaterialList(index,x.MaterialmasterData?.material_type_details[0].id);

          this.form.requested_items[index].requested_material_sub_group = x.MaterialmasterData?.material_type_details[0].id;

          this.form.requested_items[index].requested_material_group = x.MaterialmasterData?.material_type_details[0].parent_id;

          this.getProcurementMaterialDetails(index)

        },2000);
      })
    }

    if (this.scope == 'view' || this.scope=='print') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }

    if (this.router.url.indexOf('/procurement/indent/create') > -1) {
      this.newAddScope = true
    } else {
      this.newAddScope = false
    }
    this.getmasterList()
  }


  addItem() {
    let addData = {
      quantity: '',
      weight_unit: '',
      requested_for: '',
      charge_type: '',
      priority: '',
      due_date: '',
      notes: [
        {
          "note_title": "Technical",
          "note_details": "",
          organization: this.localStorageData.organisation_details[0].id
        },
        {
          "note_title": "Warranty",
          "note_details": "",
          organization: this.localStorageData.organisation_details[0].id

        },
        {
          "note_title": "Other",
          "note_details": "",
          organization: this.localStorageData.organisation_details[0].id

        },
        {
          "note_title": "Justification",
          "note_details": "",
          organization: this.localStorageData.organisation_details[0].id

        }
      ],
      requested_material: '',
      currentStock: 0,
      MaterialBOQ: [],
      project_id: this.form?.requested_items[0]?.project_id ? this.form.requested_items[0].project_id : this.datasharedservice.getLocalData('selectedProject'),
      site_id: '',
      material_request_item: '',
      delivery_schedule : 'date'
    }
    this.form.requested_items.push(addData)

  }


  ngOnInit(): void {
    
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getmasterList()
    this.getUomList()
    this.getMaterialParent()
        
    this.setSelectedMRDetails = this.selectedMRDetails?.map((item: any) => {
      if(!item.sanctioned_quantity){
        item.sanctioned_quantity=item.quantity;
      }
      return {
        quantity: item.sanctioned_quantity,
        weight_unit: item.weight_unit,
        size_part_grade:item.size_part_grade,
        stock_on_site:item.stock_on_site,
        brand:item.brand,
        application:item.application,
        delivery_schedule:item.delivery_schedule,
        delivery_schedule_day : item.delivery_schedule_day ,
        delivery_schedule_date : item.delivery_schedule_date ,
        budgeted_qty: item.budgeted_qty,
        uom: item.uom_id,
        total_received_uptodate: item.total_received_uptodate,
        requested_for: item.requested_for_type,
        charge_type: item.charge_type,
        priority: item.priority,
        due_date: item.due_date,
        notes: [
          {
            "note_title": "Technical",
            "note_details": item.notes.find((val:any)=>val.note_title=='Technical').note_details,
            organization: this.localStorageData.organisation_details[0].id
          },
          {
            "note_title": "Warranty",
            "note_details":  item.notes.find((val:any)=>val.note_title=='Warranty').note_details,
            organization: this.localStorageData.organisation_details[0].id

          },
          {
            "note_title": "Other",
            "note_details":  item.notes.find((val:any)=>val.note_title=='Other').note_details,
            organization: this.localStorageData.organisation_details[0].id

          },
          {
            "note_title": "Justification",
            "note_details": "",
            organization: this.localStorageData.organisation_details[0].id

          }
        ],
        requested_material: item.requested_material_id,
        currentStock: 0,
        MaterialBOQ: [],
        project_id: item.material_request[0]?.project_id || null,
        site_id: item.material_request[0]?.site_id || null,
        material_request_item: item.id
      };

      // this.form.requested_items[index].requested_material_group = this.masterlist[i].material_type_name
      // this.setMaterialSubGroup(index)
      // this.form.requested_items[index].requested_material_sub_group = this.masterlist[i].material_sub_type_name
      // this.setMaterialList(index)

    });

    this.form = {
      indent_form_table: false,
      requested_items: this.setSelectedMRDetails,
      project: this.setSelectedMRDetails[0]?.project_id,
      site: this.setSelectedMRDetails[0]?.site_id
    };

    this.form.requested_items.forEach((x: any, index: any) => {
      this.getProcurementMaterialDetails(index)
    })

    if(this.scope == 'create' && this.newAddScope) {
      this.addItem()
    }
  }

  checkFromStock(i: any){
    if(this.form.requested_items[i].quantity > this.form.requested_items[i].currentStock){
      this.form.requested_items[i].quantity = 0
    }
  }

  getAllMaterialList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.masterlist = data.results
      if(this.form.requested_items.length > 0) {
        for(let i=0;i<this.form.requested_items.length;i++) {

          let filter = this.masterlist.filter((item: { id: any; }) => item.id == this.form.requested_items[i].requested_material)
          if(filter.length > 0) {
            this.form.requested_items[i].requested_material_group = filter[0].material_type_details[0].parent_id
            this.form.requested_items[i].requested_material_sub_group = filter[0].material_type_details[0].id
            this.setMaterialSubGroup(i, filter[0].material_type_details[0].parent_id)
            this.setMaterialList(i, filter[0].material_type_details[0].id)
          }
        }
      }
      
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

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.masterlist = data.results;
      this.generateMaterialData()
      this.form.requested_items.forEach((x: any, index: any) => {
        this.filterMasterList(index)
        this.setMaterialMasterData(index)
      })
    })
  }

  filterMasterList(index: number) {
    for (let i = 0; i < this.masterlist.length; i++) {
      if (this.masterlist[i].id == this.form.requested_items[index].requested_material) {
        this.form.requested_items[index].requested_material_group = this.masterlist[i].material_type_details[0].parent_id
        this.setMaterialSubGroup(index,'')
        this.form.requested_items[index].requested_material_sub_group = this.masterlist[i].material_type_details[0].id
       // this.setMaterialList(index)
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


  getProcurementMaterialDetails(index: any) {
    
    let params = new URLSearchParams();
    params.set('id', this.form.requested_items[index].requested_material);
    params.set('project', this.form.requested_items[index].project_id);
    this.procurementApiService.getProcurementMaterialDetails(params).subscribe(data => {
      this.form.requested_items[index].MaterialBOQ = data.Data

      this.form.requested_items[index].total_received_uptodate = (data.results[0]?.total_recieved_quantity) ? (data.results[0]?.total_recieved_quantity) : 0      
      this.form.requested_items[index].budgeted_qty = (data.results[0]?.total_project_quantity) ? (data.results[0]?.total_project_quantity) : 0
      this.form.requested_items[index].currentStock = (data.results[0]?.total_balance_quantity)? (data.results[0]?.total_balance_quantity) : 0
    })
    this.form.requested_items[index].currentStock = '0'

    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    if(this.form.requested_items[index].site_id) {
      req.set('site', this.form.requested_items[index].site_id)
    }
    if(this.form.requested_items[index].store_id) {
      req.set('store', this.form.requested_items[index].store_id)
    }
    req.set('material', this.form.requested_items[index].requested_material);

    this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
      
      this.form.requested_items[index].stock_on_site = (data.results[0]?.quantity)? (data.results[0]?.quantity) : 0
      
    })
  }


  delete(index: any) {
    this.form.requested_items.splice(index, 1);
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit(): void {
    this.form.indent_form_table = true
    JSON.stringify(this.form)
    this.parrentAction.emit(JSON.stringify(this.form))
  }

  setMaterialSubGroup(index: number,typeid:any) {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.requested_items[index].MaterilSubGroupList = data.results;      
    })
  }

  setMaterialList(i:any,subtypeId:any) {
    if(subtypeId) {
      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('material_type', subtypeId);
      params2.set('page', '1');
      params2.set('page_size', '1000');
  
      this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
        this.form.requested_items[i].MaterilFilterList = data2.results;
      })
    }
      // ========= getting materials =========
  }

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }

  changeStatus(data: any, itemData: any) {
    if(itemData.sanctioned_quantity) {
      this.editData.status = data
      if (this.editData.status != '') {
        let req = [{
          id: itemData.id,
          status: this.editData.status,
          sanctioned_quantity: itemData.sanctioned_quantity,
          sanctioned_remarks: itemData.sanctioned_remarks
        }]
        let params = new URLSearchParams();
        params.set('organization_id', this.localStorageData.organisation_details[0].id);
        params.set('type', 'indent-items');
        this.procurementApiService.updateProcurementSatatus(params, req).subscribe(data => {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          window.location.reload()
        })
      }
    } else {
      this.save()
    }
  }

  setMaterialMasterData(index: number) {
    this.form.requested_items[index].project_id = this.form?.requested_items[0]?.project_id ? this.form.requested_items[0].project_id : this.datasharedservice.getLocalData('selectedProject')
    this.form.requested_items[index].site_id = this.form?.requested_items[0]?.site_id ? this.form.requested_items[0].site_id : this.datasharedservice.getLocalData('selectedSite')
    this.form.requested_items[index].store_id = this.form?.requested_items[0]?.store_id ? this.form.requested_items[0].store_id : this.datasharedservice.getLocalData('selectedStore')

    for (let i = 0; i < this.masterlist.length; i++) {
      if (this.masterlist[i].id == this.form.requested_items[index].requested_material) {
        this.form.requested_items[index].MaterialmasterData = this.masterlist[i]
        this.form.requested_items[index].MaterialmasterData.uomList = []
        this.form.requested_items[index].MaterialmasterData.uomList.push(parseInt(this.form.requested_items[index].MaterialmasterData.unit_of_mesurement))
        // this.form.items[index].uom = parseInt(this.form.items[index].MaterialmasterData.unit_of_mesurement)
        for(let ii=0;ii<this.form.requested_items[index].MaterialmasterData.second_uom.length;ii++) {
          this.form.requested_items[index].MaterialmasterData.uomList.push(parseInt(this.form.requested_items[index].MaterialmasterData.second_uom[ii].second_uom))
        }
        this.getProcurementMaterialDetails(index)
        break;
      }
    }
  }
}
