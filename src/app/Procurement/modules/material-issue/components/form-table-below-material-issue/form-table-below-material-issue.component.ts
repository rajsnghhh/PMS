import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-form-table-below-material-issue',
  templateUrl: './form-table-below-material-issue.component.html',
  styleUrls: ['./form-table-below-material-issue.component.scss']
})
export class FormTableBelowMaterialIssueComponent {
  localStorageData: any
  @Output() parrentAction = new EventEmitter<any>();
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  masterlist: any = []
  allMaterialList :any = []
  uomList: any
  materialGroupList: any = []
  @Input() selectedMRDetails: any;

  setSelectedMRDetails: Array<any> = [];

  form: any = {
    requested_items : []
  };
  @Input() preFieldData: any;
  @Input() scope: any;
  disabledEdit = true

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    public router: Router,
    private toastrService: ToastrService,
    private procurementApiService: PROCUREMENTAPIService
  ) { }



  ngOnChanges(changes: SimpleChanges): void {

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getAllMaterialList()

    if ((this.scope == 'update' || this.scope == 'view') && this.preFieldData?.id) {
      this.preFieldData?.issue_items.forEach((item: any) => {
        item.project_id = this.preFieldData.project;
        item.site_id = this.preFieldData.site;
      });

      this.form.requested_items = this.preFieldData?.issue_items     
      this.form.requested_items.forEach((x: any, index: any) => {
        this.getProcurementMaterialDetails(index,true)

        setTimeout(() => {
          this.setUOM(x.requested_material, index)
        }, 1500)
        
      })

    }

    if(this.scope == 'add') {
      this.setSelectedMRDetails = this.selectedMRDetails?.map((item: any) => {
        
        return {
          quantity: item.quantity_unit,
          weight_unit: item.weight_unit,
          uom:item.uom,
          requested_for: item.requested_for,
          charge_type: item.charge_type,
          priority: item.priority,
          is_returnable: item.is_returnable,
          is_chargeable: item.is_chargeable,
          due_date: item.due_date,
          notes: [
            {
              "note_title": "Technical",
              "note_details": "",
              'organization': this.localStorageData.organisation_details[0].id
            },
            {
              "note_title": "Warranty",
              "note_details": "",
              'organization': this.localStorageData.organisation_details[0].id
            },
            {
              "note_title": "Other",
              "note_details": "",
              'organization': this.localStorageData.organisation_details[0].id
            },
            {
              "note_title": "Justification",
              "note_details": "",
              'organization': this.localStorageData.organisation_details[0].id
            }
          ],
          requested_material: item.requested_material_id,
          currentStock: 0,
          MaterialBOQ: [],
          project_id: item.material_request[0]?.project_id || null,
          site_id: item.material_request[0]?.site_id || null,
          material_request_item: item.id
  
        };  

      });

      this.form = {
        material_form_table: false,
        requested_items: this.setSelectedMRDetails,
        project: this.setSelectedMRDetails[0]?.project_id,
        site: this.setSelectedMRDetails[0]?.site_id
      };
  
      this.form.requested_items.forEach((x: any, index: any) => {
        this.getProcurementMaterialDetails(index,true)
      })
  
    }

    if (this.scope == 'view') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }

  addItem() {
    this.form.requested_items.push({
      is_chargeable: true,
    })
  }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getmasterList()
    this.getUomList()
  }

  typeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.requested_items[i].MaterilSubGroupList = data.results;
    })
  }

  subTypeChange(typeid: any, i: any){
    let params2 = new URLSearchParams();
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.requested_items[i].MaterilFilterList = data2.results;
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

    // let preFilledItemGroupId = "";
    // let preFilledSubItemGroupId = "";
    // let preFilledItemId = "";

    // let j = 0;
    // for(let reqItem of this.form.requested_items){
    //   this.typeChange(preFilledItemGroupId, j)
    //   this.subTypeChange(preFilledSubItemGroupId, j)
    //   j++
    // }
  }

  getAllMaterialList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.allMaterialList = data.results
      if(this.form.requested_items.length > 0) {
        for(let i=0;i<this.form.requested_items.length;i++) {

          let filter = this.allMaterialList.filter((item: { id: any; }) => item.id == this.form.requested_items[i].requested_material)
          if(filter.length > 0) {
            this.form.requested_items[i].requested_material_group = filter[0].material_type_details[0].parent_id
            this.form.requested_items[i].requested_material_sub_group = filter[0].material_type_details[0].id
            this.typeChange(filter[0].material_type_details[0].parent_id, i)
            this.subTypeChange(filter[0].material_type_details[0].id, i)
          }
        }
      }
      
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


  getProcurementMaterialDetails(index:any,autoPopulateScope:boolean) {

    if(this.datasharedservice.getLocalData('selectedProject') || this.form.project) {
      let params = new URLSearchParams();
      params.set('id', this.form.requested_items[index].requested_material);
      if(this.datasharedservice.getLocalData('selectedProject')) {
        params.set('project', this.datasharedservice.getLocalData('selectedProject'));
      }else {
        params.set('project', this.form.project);
      }
      this.procurementApiService.getProcurementMaterialDetails(params).subscribe(data => {
        this.form.requested_items[index].MaterialBOQ = data.Data
        
        this.form.requested_items[index].total_received_uptodate = (data.results[0]?.total_recieved_quantity) ? (data.results[0]?.total_recieved_quantity) : 0      
        this.form.requested_items[index].budgeted_qty = (data.results[0]?.total_project_quantity) ? (data.results[0]?.total_project_quantity) : 0
        this.form.requested_items[index].currentStock = (data.results[0]?.total_balance_quantity)? (data.results[0]?.total_balance_quantity) : 0
      })
      this.form.requested_items[index].currentStock = '0'

      let req = new URLSearchParams();
      req.set('organization_id', this.localStorageData.organisation_details[0].id);
      if(this.datasharedservice.getLocalData('selectedSite')) {
        req.set('site', this.datasharedservice.getLocalData('selectedSite'));
      }else {
        req.set('site', this.form.site);
      }
      req.set('material', this.form.requested_items[index].requested_material);

      this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
      
        this.form.requested_items[index].stock_on_site = (data.results[0]?.quantity)? (data.results[0]?.quantity) : 0
        
      })
      
    }else {
      this.toastrService.error('Project not selected yet!', '', {
        timeOut: 2000,
      });
    }
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
    this.form.material_form_table = true
    JSON.stringify(this.form)
    this.parrentAction.emit(JSON.stringify(this.form))
  }

  

  

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }

  setMaterialMasterData(index:number,autoPopulateScope:boolean) {

    for(let i=0;i<this.form.requested_items[index].MaterilFilterList.length;i++) {
      if(this.form.requested_items[index].MaterilFilterList[i].id == this.form.requested_items[index].requested_material) {
        this.form.requested_items[index].MaterialmasterData = this.form.requested_items[index].MaterilFilterList[i]

        this.getProcurementMaterialDetails(index,autoPopulateScope)
        if(autoPopulateScope) {
          this.form.requested_items[index].requested_material_group = this.masterlist[i].material_type_name
          this.form.requested_items[index].requested_material_sub_group = this.masterlist[i].material_sub_type_name
        }
        break;
      }
    }

    this.setUOM(this.form.requested_items[index].requested_material, index)
  }

  setUOM(event: any, index: any) {
    if (this.form.requested_items[index].MaterilFilterList) {
      const selectedItemId = event;

      const selectedMasterData = this.form.requested_items[index].MaterilFilterList.find((item: any) => item.id === parseInt(selectedItemId));
      if (selectedMasterData) {
        this.unitDropdownData(selectedMasterData, index);
        this.form.requested_items[index].uom = selectedMasterData.unit_of_mesurement;
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
    this.form.requested_items[ind].uomlistData = this.uomList.filter((item: any) => uomarray.includes(item.id));

  }


}
