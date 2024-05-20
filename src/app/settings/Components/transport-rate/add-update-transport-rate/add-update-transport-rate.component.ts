import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';


@Component({
  selector: 'app-add-update-transport-rate',
  templateUrl: './add-update-transport-rate.component.html',
  styleUrls: [
    './add-update-transport-rate.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddUpdateTransportRateComponent implements OnInit, OnChanges {
  localStorageData:any
  itemArray:any = []
  itemObj:any = {}

  // requested_items: any[] = [];

  sub_contractorList: Array<any> = [];

  @Output() parrentAction = new EventEmitter<any>();

  @Output("getTransportRateList") getTransportRateList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  @ViewChild('submitButton', { read: ElementRef })

  submitButton!: ElementRef<HTMLElement>;
  masterlist:any = []
  materialGroupList:any = []
  materialSubTypeList:any = []
  uomList:any = []
  disabledEdit = true
  // prefieldData : any = {}

  @Input() prefieldData: any;
  @Input() onEditAccess: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  form:any = {
    transport_table : false,
    sub_contractor : '',
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
    
    this.viewVendorList()

    this.getmasterList();
    this.getUomList()
    
    if((this.onEditAccess == 'add')) {
      this.addItem();
    }
  }

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
    
    this.form.sub_contractor = datalist.sub_contractor
    let i = 0;
    for(let item of datalist.items) {
      
      // === sub searching =======
      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('parent', item.item_group_detail[0].parent_id);
      
      this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {
        
      })
      // === sub searching =======

      let temp = {
        requested_material_group: item.item_group_detail[0].parent_id,
        requested_material_sub_group: item.item_group_detail[0].id,
        requested_material: item.item, //id
        unit: item.uom_detail[0].id,

        fixed_rate: item.fixed_rate,
        fixed_rate_km: item.fixed_rate_km,
        rate_per: item.rate_per,
        rate_km: item.rate_km,
      }
      this.form.requested_items.push(temp)
      i++
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
    this.form.requested_items[i].requested_material_sub_group = '';
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
      "fixed_rate": "0",
      "fixed_rate_km": "0",
      "rate_per": "0",
      "rate_km": "0",
    })
  }
  
  delete(index:any) {
    this.form.requested_items.splice(index, 1);
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  addUpdateTransportRate() { 
    if (!this.prefieldData) {
      for(let item of this.form.requested_items){

        let itemObj = {
          organization: this.localStorageData.organisation_details[0].id,
          item: item.requested_material,
          fixed_rate: item.fixed_rate,
          fixed_rate_km: item.fixed_rate_km,
          rate_per: item.rate_per,
          rate_km: item.rate_km
        }
        this.itemArray.push(itemObj)

      }
      
      let TRANSPORT_RATE_ADD_OBJ = {
        organization: this.localStorageData.organisation_details[0].id,
        sub_contractor: this.form.sub_contractor,
        items: this.itemArray,
      }

      this.apiservice.addTransportRate(TRANSPORT_RATE_ADD_OBJ).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getTransportRateList.emit();
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
      for(let item of this.form.requested_items){

        let itemObj = {
          organization: this.localStorageData.organisation_details[0].id,
          item: item.requested_material,
          fixed_rate: item.fixed_rate,
          fixed_rate_km: item.fixed_rate_km,
          rate_per: item.rate_per,
          rate_km: item.rate_km
        }
        this.itemArray.push(itemObj)

      }

      let TRANSPORT_RATE_UPDATE_OBJ = {
        organization: this.localStorageData.organisation_details[0].id,
        sub_contractor: this.form.sub_contractor,
        items: this.itemArray,
      }

      this.apiservice.editTransportRate(TRANSPORT_RATE_UPDATE_OBJ, this.prefieldData.organization, this.prefieldData.id).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(data.msg, '', {
            timeOut: 2000,
          });

          this.closeModal.emit();
          this.getTransportRateList.emit();
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
