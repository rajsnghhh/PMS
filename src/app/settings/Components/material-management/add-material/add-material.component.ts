import { Component, EventEmitter, OnInit, Input, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.scss',
    '../../../../../assets/scss/from-coomon.scss'
  ]
})
export class AddMaterialComponent implements OnInit, OnChanges {
  @Output() parentFun = new EventEmitter<string>();


  @Input()
  scope!: any;
  
  environment = environment


  @Input()
  selectedID!: any;


  localStorageData: any;
  importData: any;
  taxHeads:any;
  materialTypeList: any;
  materialSubTypeList: any;
  materialCostHeadList: any;
  materialSubCostHeadList: any;
  uomList: any;
  prevuomList: any;
  secondUomList: any;
  naturePropertiesList: any;
  KeyScopesData: any = [];
  afterAdd: boolean = false;
  HSN_List :any = []

  addMaterial: any = {
    code: '',
    sapcode: '',
    groupcode : '',
    subGroupCode : '',
    materialCode : '',
    materialtype: '',
    name: '',
    description: '',
    mtype: '',
    msubtype: '',
    costhead: '',
    subcosthead: '',
    uom: '',
    seconduom: '',
    nature: '',
    leadtime: '',
    valuation: '',
    tolerance: '',
    shortclose: '',
    hsncode: '',
    part_no : '',
    gst_tax:'',
    remarks:''
  }

  constructor(
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private navservice: NavigationService,
    private toastrService: ToastrService,
    private procurementAPIService:PROCUREMENTAPIService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.scope == 'edit' && this.selectedID) {
      this.getPrefielddata()
    }
  }

  getPrefielddata() {
    this.importData='';
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.selectedID);

    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      
      this.addMaterial.code = data.material_code
      this.addMaterial.sapcode = data.sap_code
      this.addMaterial.materialtype = data.materialtype
      this.addMaterial.remarks = data.remarks
      this.addMaterial.name = data.material_name
      this.addMaterial.imagefile=data.material_image;
      // this.addMaterial.groupcode = data.material_code
      // this.addMaterial.subGroupCode = data.material_code
      this.addMaterial.id = data.id
      this.addMaterial.description = data.material_descriptions

      // ======= parent searching ============
      let params = new URLSearchParams();

      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      if(data.material_type_details[0].parent_id){
        params.set('id', data.material_type_details[0].parent_id);
      }
      
      this.apiservice.getMaterialTypeList(params).subscribe(data => {
        // this.addMaterial.mtype = data.id

        // === sub searching =======
        let params2 = new URLSearchParams();
        params2.set('organization_id', this.localStorageData.organisation_details[0].id);
        if(this.addMaterial.mtype){
          params2.set('parent', this.addMaterial.mtype);
        }
        
        this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {
          this.materialSubTypeList = data2.results
        })
        // === sub searching =======
      })
      // ======= parent searching ENDS ============
      if(data.material_type_details[0].parent_id === null){
        this.addMaterial.mtype = data.material_type_details[0].id
      }else {
        this.addMaterial.mtype = data.material_type_details[0].parent_id
        this.addMaterial.msubtype = data.material_type_details[0].id
      }
      
      this.addMaterial.costhead = data.material_cost_head
      if(this.addMaterial.costhead){
        this.costheadChange(this.addMaterial.costhead)
      }
      this.addMaterial.subcosthead = data.material_sub_cost_head
      if(data.second_unit_of_mesurement && data.second_unit_of_mesurement.length > 0) {
        this.KeyScopesData = []
        for(let j=0;j<data.second_unit_of_mesurement.length;j++) {
          this.KeyScopesData.push({
            conversion_rate: data.second_unit_of_mesurement[j].conversion_rate,
            second_uom: data.second_unit_of_mesurement[j].second_uom,
            primary_rate: data.second_unit_of_mesurement[j].primary_rate
          });
        }
        
      }

      this.addMaterial.uom = data.unit_of_mesurement
      this.prevuomList = data.unit_of_mesurement_name
      this.addMaterial.seconduom = data.second_unit_applicability
      this.addMaterial.nature = data.material_nature
      
      this.addMaterial.part_no = data?.part_no
      this.addMaterial.gst_tax = data?.gst_tax
      this.addMaterial.leadtime = data.material_lead_time
      this.addMaterial.valuation = data.material_valuation
      this.addMaterial.tolerance = data.material_tolerance
      this.addMaterial.shortclose = data.material_short_close_required
      this.addMaterial.hsncode = data.hsncode
      let codelist =data.material_code.split('-')
      this.addMaterial.code = data.material_code
      this.addMaterial.groupcode = codelist[0]
      this.addMaterial.subGroupCode = codelist[1]
      this.addMaterial.materialCode = codelist[2]
    })
  }

  resetADD(form: NgForm): void {
    this.parentFun.emit();
    form.reset();
  }

  generateKey(data:any) { 
    this.addMaterial.code = ''
    this.addMaterial.groupcode = ''
    this.addMaterial.subGroupCode = ''
    this.addMaterial.materialCode = ''
    let codePrefix = ''
    if( this.addMaterial.mtype && this.addMaterial.msubtype ) { 
      for(let i=0;i<this.materialTypeList.length;i++) {
        if(this.materialTypeList[i].id == this.addMaterial.mtype) {
          codePrefix += this.materialTypeList[i].code + '-'
          this.addMaterial.groupcode = this.materialTypeList[i].code;
          break;
        }
      }
      
      for(let i=0;i<this.materialSubTypeList.length;i++) {
        if(this.materialSubTypeList[i].id == this.addMaterial.msubtype) {
          // if(data != '') {
          //   codePrefix += this.materialSubTypeList[i].code + '-' + this.formatNumber(data)
          //   this.addMaterial.subGroupCode = this.materialSubTypeList[i].code;
          //   this.addMaterial.materialCode = this.formatNumber(data)
          // }else {
          //   codePrefix += this.materialSubTypeList[i].code + '-' + this.formatNumber(this.materialSubTypeList[i].count + 1)
          //   this.addMaterial.subGroupCode = this.materialSubTypeList[i].code;
          //   this.addMaterial.materialCode = this.formatNumber(this.materialSubTypeList.length + 1) 
          // }

          if(data == '') {
            codePrefix += this.materialSubTypeList[i].code + '-' + this.formatNumber(this.materialSubTypeList[i].count + 1)
            this.addMaterial.subGroupCode = this.materialSubTypeList[i].code;
            this.addMaterial.materialCode = this.formatNumber(this.materialSubTypeList.length + 1) 
          }
          break;
        }
      }
      this.addMaterial.code = codePrefix
    }
  }

  formatNumber(number:string) {
    let cnumber = parseInt(number)
    
    if(cnumber >=0 && cnumber<10) {
      return '000'+cnumber

    } else if (cnumber>=10 && cnumber<100) {
      return '00'+number

    } else if(cnumber>=100 && cnumber<1000) {
      return '0'+cnumber

    } else {
      return cnumber

    }
    
  }

  ngOnInit(): void {

    this.getMaterialParent();
    // this.getMaterialType();
    this.getMaterialCostHead();
    this.getUOMData();
    this.getNaturePropertiesData();
    this.getHsnList();
    this.getTaxHeadData();
    this.KeyScopesData.push({
      conversion_rate: '',
      second_uom: '',
      primary_rate: ''
    });
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tax_type', 'gst_tax')
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
    this.taxHeads = data.results;
    });
  }
  addKeyScope() {
    this.KeyScopesData.push({
      conversion_rate: '',
      second_uom: '',
      primary_rate: ''
    });
  }
  removeKeyScope(rid: number) {
    this.KeyScopesData.splice(rid, 1);
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

  getHsnList() {
    let params = new URLSearchParams();
    this.apiservice.getHSNList(params).subscribe(data => {
      this.HSN_List = data.results;
    })
  }

  getMaterialCostHead() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialCostHeadList(params).subscribe(data => {
      this.materialCostHeadList = data.results;
    })
  }

  getUOMData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }


  getNaturePropertiesData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getNature_PropertiesList(params).subscribe(data => {
      this.naturePropertiesList = data.results;
    })
  }

  typeChange(typeid: any) {
    this.addMaterial.msubtype = '';
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialSubTypeList = data.results;      
      // this.generateKey('')
    })
  }

  costheadChange(costheadid: any) {
    this.addMaterial.subcosthead = '';
    let params = new URLSearchParams();
    params.set('id', costheadid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialCostHeadList(params).subscribe(data => {
      this.materialSubCostHeadList = data;
    })
  }
  uomChange(uomId: any) {
    this.addMaterial.seconduom = '';
    let params = new URLSearchParams();
    params.set('id', uomId);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getUOMList(params).subscribe(data => {
      this.secondUomList = data;
      this.prevuomList = data.symbol;
    })
  }

  uploadFile(event: any) {
    this.importData = event.target.files[0];
  }

  addnewMaterial() {
    this.afterAdd = true;
    var form_data = new FormData();
    form_data.append('organization', this.localStorageData.organisation_details[0].id);
    form_data.append('materialtype', this.addMaterial.materialtype);
    form_data.append('remarks', this.addMaterial.remarks);
    form_data.append('material_name', this.addMaterial.name);
    form_data.append('material_code', this.addMaterial.code);
    form_data.append('sap_code', this.addMaterial.sapcode);
    form_data.append('material_descriptions', this.addMaterial.description);
    form_data.append('material_type', this.addMaterial.msubtype ? this.addMaterial.msubtype : this.addMaterial.mtype);
    form_data.append('hsncode', this.addMaterial.hsncode);
    form_data.append('part_no', this.addMaterial.part_no);
    form_data.append('unit_of_mesurement', this.addMaterial.uom);
    form_data.append('material_nature', this.addMaterial.nature);
    if(this.addMaterial.leadtime){
      form_data.append('material_lead_time', this.addMaterial.leadtime);
    }else{
      form_data.append('material_lead_time', '0');
    }
    // form_data.append('material_sub_type', this.addMaterial.msubtype);

    if(this.addMaterial.costhead){
      form_data.append('material_cost_head', this.addMaterial.costhead);
    }
    if(this.addMaterial.subcosthead){
      form_data.append('material_sub_cost_head', this.addMaterial.subcosthead);
    }
    if(this.addMaterial.second_uom){
      form_data.append('second_unit_applicability', this.addMaterial.seconduom);
    }
    if(this.addMaterial.valuation){
      form_data.append('material_valuation', this.addMaterial.valuation);
    }
    if(this.addMaterial.tolerance){
      form_data.append('material_tolerance', this.addMaterial.tolerance);
    }
    if(this.addMaterial.gst_tax){
      form_data.append('gst_tax', this.addMaterial.gst_tax);
    }
    if (this.addMaterial.seconduom == 'Yes') {
      form_data.append('second_uoms', JSON.stringify(this.KeyScopesData));
    }
    // else {
    //   form_data.append('second_uoms', '');
    // }

    if (this.importData) {
      form_data.append('material_image', this.importData);
    }
    if(this.scope=='add') {
      this.apiservice.addMaterial(form_data).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.parentFun.emit();
        this.addMaterial = {}
  
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
        this.afterAdd = false;
        
      })
    } else {
      let params = new URLSearchParams();
      params.set('id', this.selectedID);
      params.set('method', 'edit');
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.apiservice.editMaterial(params,form_data).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.parentFun.emit();
        this.addMaterial = {}
  
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
        this.afterAdd = false;
        
      })
    }


  }
  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: { markAsTouched: () => void; controls: any[]; }) => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach((c: FormGroup) => this.markFormGroupTouched(c));
      }
    });
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
