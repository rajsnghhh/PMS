import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-create-mr-table',
  templateUrl: './create-mr-table.component.html',
  styleUrls: [
    './create-mr-table.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class CreateMrTableComponent implements OnInit, OnChanges{
  localStorageData:any
  @Output() parrentAction = new EventEmitter<any>();
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  masterlist:any = []
  materialGroupList:any = []
  uomList:any = []
  disabledEdit = true
  editData : any = {}
  @Input() prefieldData: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  form:any = {
    mr_table : false,
    requested_items : []
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

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if((this.scope == 'update' || this.scope == 'view' || this.scope == 'print'  ) && this.prefieldData.id) {
      this.form.project = this.prefieldData.project
      this.form.site = this.prefieldData.site
      this.form.status = this.prefieldData.status
      this.getmasterList1(this.prefieldData.requested_items)
      // this.generatePrepopulateData(this.prefieldData.requested_items)
    }
    if(this.scope == 'view' || this.scope == 'print') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }

  generatePrepopulateData(datalist:any) {
    this.form.requested_items = []
    
    for(let i=0;i<datalist.length;i++) {
      // === parent searching =======
      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('id', datalist[i].material_details.material_type);
      
      this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {
        let temp = {
          id : datalist[i].id,
          charge_type : datalist[i].charge_type,
          department : datalist[i].department,
          due_date : datalist[i].due_date,
          is_returnable : datalist[i].is_returnable,
          notes : datalist[i].notes,
          organization : datalist[i].organization,
          priority : datalist[i].priority,
          quantity_unit : datalist[i].quantity_unit,
          requested_for : datalist[i].requested_for,
          requested_for_type : datalist[i].requested_for_type,
          searchItem : datalist[i].requested_material,
          requested_material_group: data2.parent,
          requested_material_sub_group: datalist[i].material_details.material_type,
          requested_material : datalist[i].requested_material,
          size_part_grade : datalist[i].size_part_grade,
          brand : datalist[i].brand,
          budgeted_qty : datalist[i].budgeted_qty,
          total_received_uptodate : datalist[i].total_received_uptodate,
          stock_on_site : datalist[i].stock_on_site,
          application : datalist[i].application,
          delivery_schedule : datalist[i].delivery_schedule ,
          delivery_schedule_day : datalist[i].delivery_schedule_day ,
          delivery_schedule_date : datalist[i].delivery_schedule_date ,
          weight_unit : datalist[i].weight_unit,
          status : datalist[i].status
        }

        this.form.requested_items.push(temp)

        let preFilledItemGroupId = data2.parent;

        let preFilledSubItemGroupId = datalist[i].material_details.material_type;
        let preFilledItemId = datalist[i].requested_material;

        let j = 0;
        for(let reqItem of this.form.requested_items){
          this.groupTypeChange(preFilledItemGroupId, j)
          this.subTypeChange(preFilledSubItemGroupId, j)
          j++
        }

        setTimeout(() => {
          this.setMaterialMasterData(i,true,datalist[i].requested_material)
        }, 1000);

      })
      // === parent searching =======
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


  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('all', 'true');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
      // this.generateMaterialData()
    })

    let preFilledItemGroupId = "";
    let preFilledSubItemGroupId = "";
    let preFilledItemId = "";

    let j = 0;
    for(let reqItem of this.form.requested_items){
      this.typeChange(preFilledItemGroupId, j)
      this.subTypeChange(preFilledSubItemGroupId, j)
      j++
    }
  }
  getmasterList1(request:any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('all', 'true');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
      
      this.generatePrepopulateData(request)
      this.generateMaterialData()
    })
  }

  typeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('all', 'true');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.requested_items[i].MaterilSubGroupList = data.results;
    })
  }

  groupTypeChange(typeid: any, i: any){
    this.form.requested_items[i].MaterilSubGroupList = '';
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('all', 'true');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.requested_items[i].MaterilSubGroupList = data.results;
    })
  }
  subTypeChange(typeid: any, i: any){
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('all', 'true');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.requested_items[i].MaterilFilterList = data2.results;
     // this.setMaterialMasterData(i,true)
    })
    // ========= getting materials =========
  }

  materialSearchIndex(index:any) {
    this.form.requested_items[index].requested_material = this.form.requested_items[index].searchItem
  }

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }

  addItem() {
    this.form.requested_items.push({
      "organization": this.localStorageData.organisation_details[0].id,
      "notes" : [
        { 
          "note_title" : "Technical",
          "note_details" : "",
          organization: this.localStorageData.organisation_details[0].id

        },
        { 
          "note_title" : "Warranty",
          "note_details" : "",
          organization: this.localStorageData.organisation_details[0].id

        },
        { 
          "note_title" : "Other",
          "note_details" : "",
          organization: this.localStorageData.organisation_details[0].id

        }
      ],
      MaterialBOQ : [],
      currentStock : '0',
      due_date : this.setDate(),
      "is_returnable": false,
      "delivery_schedule": "date",
     
    })
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

  setMaterialMasterData(index:number,autoPopulateScope:boolean,event:any) {

    if(this.form.requested_items[index].MaterilFilterList){
      let findData = this.form.requested_items[index].MaterilFilterList.filter((item: { id: any; }) => item.id == this.form.requested_items[index].requested_material)
      if(findData.length > 0) {
        this.form.requested_items[index].MaterialmasterData = findData[0]
        this.getProcurementMaterialDetails(index,true)
      } else {
        this.form.requested_items[index].MaterialmasterData = {}
      }
    }
    this.setUOM(event, index)

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

  setMaterialSubGroup(index:number) {
    let findText = this.form.requested_items[index].requested_material_group
    let catagoryList = this.masterlist.filter(function (el:any) {
      return el.material_type_name == findText
    });
    let subCatagoryList = [...new Set(catagoryList.map((item: { material_sub_type_name: any; }) => item.material_sub_type_name))];
    this.form.requested_items[index].MaterilSubGroupList = subCatagoryList
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
        
        if((this.scope != 'update' && this.scope != 'view') || !autoPopulateScope) {
          for(let noteindex=0;noteindex<this.form.requested_items[index].notes.length;noteindex++) {
            if(this.form.requested_items[index].notes[noteindex].note_title == 'Justification') {
              this.form.requested_items[index].notes.splice(noteindex, 1);
            }
          }
          if(data.Data.length == 0) {
            this.form.requested_items[index].notes.push({
              "note_title" : "Justification",
              "note_details" : "",
              organization: this.localStorageData.organisation_details[0].id

            }) 
          }
        }
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

  checkFromStock(i: any){
    // if(this.form.requested_items[i].quantity_unit > this.form.requested_items[i].currentStock){
    //   this.form.requested_items[i].quantity_unit = 0
    // }
  }

  delete(index:any) {
    this.form.requested_items.splice(index, 1);
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit(): void {
    this.form.mr_table = true
    
    JSON.stringify(this.form, null, 2)
    this.parrentAction.emit(JSON.stringify(this.form, null, 2))
  }
}
