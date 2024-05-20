import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharingService } from 'src/app/Procurement/modules/purchase/data-sharing.service';

@Component({
  selector: 'app-add-update-material-wastage',
  templateUrl: './add-update-material-wastage.component.html',
  styleUrls: [
    './add-update-material-wastage.component.scss',
    '../../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class AddUpdateMaterialWastageComponent {
  localStorageData:any
  itemArray:any = []
  itemObj:any = {}

  // requested_items: any[] = [];
  siteList: Array<any> = [];
  sub_contractorList: Array<any> = [];

  @Output() parrentAction = new EventEmitter<any>();

  @Output("getMaterialWastageList") getMaterialWastageList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  @ViewChild('submitButton', { read: ElementRef })

  submitButton!: ElementRef<HTMLElement>;
  storeList: any = [];
  masterlist:any = []
  materialGroupList:any = []
  materialSubTypeList:any = []
  uomList:any = []
  disabledEdit = true
  importData: any;
  financialYearData: any = []

  // prefieldData : any = {}

  @Input() prefieldData: any;
  @Input() onEditAccess: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  form:any = {
    wastage_table : false,

    financialyear: '',
    material_waste_code : '',
    material_waste_no : '',
    date : '',
    wastage_type : '',
    location : '',
    is_stock_effect_required : '',
    requested_items : [],
    attachments : [],
  };

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService : PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private dataService: DataSharingService,
  ) {
    
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.form.financialyear = this.localStorageData.financial_year[0].id

    this.getFinancoialYearData()
    // this.getSiteList()
    this.getStoreList()
    //this.viewVendorList()

    this.getmasterList();
    this.getUomList()
    
    if((this.onEditAccess == 'add')) {
      this.addItem();
    }
  }

  getFinancoialYearData() {
    this.procurementApiService.getFinanCialyrData().subscribe(data => {
      this.financialYearData = data.results;
    })
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('site__project', this.form.project);
    // params.set('site', this.form.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })
  }

  // getSiteList() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   // params.set('project', this.selectedMRDetails.project);
  //   params.set('all', 'true');
  //   this.apiservice.getProcurementSiteList(params).subscribe(data => {
  //     this.siteList = data.results;
  //   })

  // }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.sub_contractorList = data.results;
      
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    
    if((this.onEditAccess == 'edit' || this.scope == 'view' || this.scope == 'print'  ) && this.prefieldData?.id) {      
      this.generatePrepopulateData(this.prefieldData)
    }
  }

  generatePrepopulateData(datalist:any) {
    this.form.requested_items = []
    
    this.form.financialyear = datalist.financialyear
    this.form.material_waste_code = datalist.material_waste_no.split('-')[0]
    this.form.material_waste_no = datalist.material_waste_no.split('-')[1]
    this.form.date = datalist.date
    this.form.wastage_type = datalist.wastage_type
    this.form.location = datalist.store
    this.form.is_stock_effect_required = datalist.is_stock_effect_required

    for(let i=0;i<datalist.items.length;i++) {
      // === parent searching =======
      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('id', datalist.items[i].material_details[0][0].material_type_id);
      
      this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {
        
        let temp = {
          requested_material_group: data2.parent,
          requested_material_sub_group: datalist.items[i].material_details[0][0].material_type_id,
          requested_material : datalist.items[i].item,
          
          quantity: datalist.items[i].quantity,
          unit: datalist.items[i].uom_details[0].id,
          weight: datalist.items[i].weight,
          weight_uom: datalist.items[i].weight_uom,
          rate: datalist.items[i].rate,
          amount: datalist.items[i].amount,
          type: datalist.items[i].type,
          remark: datalist.items[i].remark,
        }

        this.form.requested_items.push(temp)

        let preFilledItemGroupId = data2.parent;
        let preFilledSubItemGroupId = datalist.items[i].material_details[0][0].material_type_id;
        let preFilledItemId = datalist.items[i].material_details[0][0].id;

        let j = 0;
        for(let reqItem of this.form.requested_items){
          this.groupTypeChange(preFilledItemGroupId, j)
          this.subTypeChange(preFilledSubItemGroupId, j)
          j++
        }

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
    let filter =  this.form.requested_items[i].MaterilFilterList.filter((item: { id: any; }) => item.id == this.form.requested_items[i].requested_material)
    
    if(filter.length > 0) {
      this.form.requested_items[i].unit = filter[0].unit_of_mesurement
    }
  }

  calculateAmount(i:any){
    let quantity = Number(this.form.requested_items[i].quantity)
    let rate = Number(this.form.requested_items[i].rate)

    let amount = quantity * rate    
    this.form.requested_items[i].amount = amount
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
    for(let reqItem of this.form.requested_items){

      this.typeChange(preFilledItemGroupId, j)
      this.subTypeChange(preFilledSubItemGroupId, j)
      j++
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
      // this.materialSubTypeList = data.results;      
      this.form.requested_items[i].MaterilSubGroupList = data.results;
      
      
    })
  }

  groupTypeChange(typeid: any, i: any){
    // this.form.requested_items[i].requested_material_sub_group = '';
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      // this.materialSubTypeList = data.results;      
      this.form.requested_items[i].MaterilSubGroupList = data.results;
      
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
      this.form.requested_items[i].MaterilFilterList = data2.results;
    })
    // ========= getting materials =========
  }

 

  setMaterialList(i: number) {
    let findGroup = this.form.requested_items[i]?.requested_material_group
    let findSubGroup = this.form.requested_items[i]?.requested_material_sub_group

    let materiallist =this.masterlist.filter(function (el:any) {
      // return el.material_type_name == findGroup && el.material_sub_type_name == findSubGroup 
      return el.material_type == findGroup && el.material_sub_type == findSubGroup 
    });
    this.form.requested_items[i].MaterilFilterList = materiallist
    
  }

  addItem() {
    this.form.requested_items.push({
      "item": "",
      "quantity": "",
      "weight": "",
      "weight_uom": "",
      "rate": "",
      "amount": "",
      "type": "",
      "remark": "",
    })
  }
  
  delete(index:any) {
    this.form.requested_items.splice(index, 1);
  }

  handleUpload(event:any) {
    this.form.attachments = []
    for(let i=0;i<event.target.files.length;i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' +file.type +';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
          this.form.attachments.push(
            {
              'organization':this.localStorageData.organisation_details[0].id,
              'file_data':data,
              'mime_type':file.type
            }
          )
      };
    }
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  addUpdateMaterialWastage() { 
    if (!this.prefieldData) {
      let params = new URLSearchParams();
      for(let item of this.form.requested_items){
        let itemObj = {
          organization: this.localStorageData.organisation_details[0].id,
          item: item.requested_material,
          quantity: item.quantity,
          weight: item.weight,
          weight_uom: item.weight_uom,
          rate: item.rate,
          amount:  Number(item.amount),
          type: item.type,
          remark: item.remark,
        }
        this.itemArray.push(itemObj)

      }
      
      let WASTAGE_ADD_OBJ = {
        financialyear: this.localStorageData.financial_year[0].id.toString(),

        organization: this.localStorageData.organisation_details[0].id,
        material_waste_no: this.form.material_waste_code +'-'+ this.form.material_waste_no,
        date: this.form.date,
        site:this.localStorageData.site_data.id,
        store: this.form.location,
        wastage_type: this.form.wastage_type,
        is_stock_effect_required: (this.form.is_stock_effect_required)? "true":"false",
        items: this.itemArray,
        attachments: this.form.attachments,
      }

      this.procurementApiService.addMaterialWastage(params, WASTAGE_ADD_OBJ).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getMaterialWastageList.emit();
        }
      }, err => {
        if (err.error.error) {
          this.toastrService.error(err.error.error, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    } else {
      let params = new URLSearchParams();
      params.set('id', this.prefieldData.id);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      for(let item of this.form.requested_items){
        let itemObj = {
          organization: this.localStorageData.organisation_details[0].id,
          item: item.requested_material,
          quantity: item.quantity,
          weight: item.weight,
          weight_uom: item.weight_uom,
          rate: item.rate,
          amount: Number(item.amount),
          type: item.type,
          remark: item.remark,
        }
        this.itemArray.push(itemObj)

      }
      
      let WASTAGE_EDIT_OBJ = {
        organization: this.localStorageData.organisation_details[0].id,
        financialyear: this.form.financialyear,
        
        material_waste_no: this.form.material_waste_code +'-'+ this.form.material_waste_no,
        date: this.form.date,
        store: this.form.location,
        wastage_type: this.form.wastage_type,
        is_stock_effect_required: (this.form.is_stock_effect_required)? "true":"false",
        items: this.itemArray,
        attachments: this.form.attachments,
      }

      this.procurementApiService.updateMaterialWastage(params, WASTAGE_EDIT_OBJ).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getMaterialWastageList.emit();
        }
      }, err => {
        if (err.error.error) {
          this.toastrService.error(err.error.error, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    }

  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
      'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    };
  }
}
