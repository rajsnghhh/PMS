import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-gate-pass-add-table',
  templateUrl: './gate-pass-add-table.component.html',
  styleUrls: [
    './gate-pass-add-table.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class GatePassAddTableComponent {
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
  @Input() isGP_Approver: any;

  form:any = {
    mr_table : false,
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

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if((this.scope == 'update' || this.scope == 'view' || this.scope == 'transportation'  ) && this.prefieldData.id) {
      this.form.project = this.prefieldData.project
      this.form.site = this.prefieldData.site
      this.form.status = this.prefieldData.status
      this.getmasterList1(this.prefieldData.items)
      // this.generatePrepopulateData(this.prefieldData.items)
    }
    if(this.scope == 'view' || this.scope == 'transportation') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
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
          id : datalist[i].id,
          item : datalist[i].item,
          quantity : datalist[i].quantity,
          unit : datalist[i].material_details[0].unit_of_mesurement_id,
          weight : datalist[i].weight,
          weight_uom : datalist[i].weight_uom,
          value : datalist[i].value,
          requested_material_group: data2.parent,
          requested_material_sub_group: datalist[i].material_details[0].material_type_id,
          organization : datalist[i].organization,
          remarks : datalist[i].remarks,
        }

        this.form.items.push(temp)

        let preFilledItemGroupId = data2.parent;
        let preFilledSubItemGroupId = datalist[i].material_details[0].material_type_id;
        let preFilledItemId = datalist[i].requested_material;

        let j = 0;
        for(let reqItem of this.form.items){
          this.groupTypeChange(preFilledItemGroupId, j)
          this.subTypeChange(preFilledSubItemGroupId, j)
          j++
        }

        this.setMaterialMasterData(i,true)
        this.getProcurementMaterialDetails(i,true)
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

  changeItem(i:any) {
    let filter =  this.form.items[i].MaterilFilterList.filter((item: { id: any; }) => item.id == this.form.items[i].item)
    
    if(filter.length > 0) {
      this.form.items[i].unit = filter[0].unit_of_mesurement
    }
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
    })
    // ========= getting materials =========
  }

  materialSearchIndex(index:any) {
    this.form.items[index].requested_material = this.form.items[index].searchItem
    this.setMaterialMasterData(index,true)
  }

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }

  addItem() {
    this.form.items.push({
      "organization": this.localStorageData.organisation_details[0].id,
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

  setMaterialMasterData(index:number,autoPopulateScope:boolean) {
    for(let i=0;i<this.masterlist.length;i++) {
      if(this.masterlist[i].id == this.form.items[index].item) {
        this.form.items[index].MaterialmasterData = this.masterlist[i]
        this.getProcurementMaterialDetails(index,autoPopulateScope)
        if(autoPopulateScope) {
          this.form.items[index].requested_material_group = this.masterlist[i].material_type_name
          this.setMaterialSubGroup(index)
          this.form.items[index].requested_material_sub_group = this.masterlist[i].material_sub_type_name
          this.setMaterialList(index)
        }
        break;
      }
    }
  }

  setMaterialSubGroup(index:number) {
    let findText = this.form.items[index].requested_material_group
    let catagoryList = this.masterlist.filter(function (el:any) {
      return el.material_type_name == findText
    });
    let subCatagoryList = [...new Set(catagoryList.map((item: { material_sub_type_name: any; }) => item.material_sub_type_name))];
    this.form.items[index].MaterilSubGroupList = subCatagoryList
  }

  setMaterialList(index:number) {
    let findGroup = this.form.items[index].requested_material_group
    let findSubGroup = this.form.items[index].requested_material_sub_group
    let materiallist =this.masterlist.filter(function (el:any) {
      return el.material_type_name == findGroup && el.material_sub_type_name == findSubGroup 
    });
    this.form.items[index].MaterilFilterList = materiallist
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

      let req = new URLSearchParams();
      req.set('organization_id', this.localStorageData.organisation_details[0].id);
      if(this.datasharedservice.getLocalData('selectedSite')) {
        req.set('site', this.datasharedservice.getLocalData('selectedSite'));
      }else {
        req.set('site', this.form.site);
      }
      req.set('material', this.form.items[index].item);      
    }else {
      // this.toastrService.error('Project not selected yet!', '', {
      //   timeOut: 2000,
      // });
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
    this.form.mr_table = true
    
    JSON.stringify(this.form, null, 2)
    this.parrentAction.emit(JSON.stringify(this.form, null, 2))
  }
}
