import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';
import { PmsDocPreviewService } from 'src/app/Shared/Services/pms-doc-preview.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-material',
  templateUrl: './edit-material.component.html',
  styleUrls: ['./edit-material.component.scss',
  '../../../../../assets/scss/from-coomon.scss'
]
})
export class EditMaterialComponent {
  @Output()
  parentFun = new EventEmitter<string>();

  localStorageData:any;
  prevValue:any;
  editingId:any;
  imageValue:any;
  importData:any;
  prevuomList: any;
  addmaterialForm! : FormGroup;
  materialTypeList:any;
  materialSubTypeList:any;
  materialCostHeadList:any;
  materialSubCostHeadList:any;
  uomList:any;
  secondUomList:any;
  naturePropertiesList:any;
  KeyScopesData:any=[];
  afterAdd:boolean=false;

  addMaterial:any = {
    code : '',
    name : '',
    description:'',
    mtype:'',
    msubtype:'',
    costhead:'',
    subcosthead:'',
    uom:'',
    seconduom:'',
    nature:'',
    leadtime:'',
    valuation:'',
    tolerance:'',
    wastage:'',
    shortclose:'',
    gstapplicable:'',
    cgst:'',
    sgst:'',
    igst:'',
  }

  constructor(
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private navservice: NavigationService,
    private docPreview:PmsDocPreviewService,
    private toastrService: ToastrService,
  ) {
    this.addmaterialForm = formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      mtype: ['', Validators.required],
      msubtype: ['', Validators.required],
      costhead:['',Validators.required],
      subcosthead:['',Validators.required],
      uom:['',Validators.required],
      seconduom:[''],
      nature:['',Validators.required],
      leadtime:['',Validators.required],
      valuation:['',Validators.required],
      tolerance:['',Validators.required],
      wastage:['',Validators.required],
      shortclose:['',Validators.required],
      gstapplicable:['',Validators.required],
      cgst:[''],
      sgst:[''],
      igst:['']
    })
   }

  

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getMaterialType();
    this.getMaterialCostHead();
    this. getUOMData();
    this.getNaturePropertiesData();

    this.KeyScopesData.push({
      conversion_rate: '',
      second_uom: '',
      primary_rate: ''
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

  prefieldData(editId:any){
    this.editingId=editId;
    let params = new URLSearchParams();
    params.set('id', editId);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {

      this.prevValue=data;
      if(data.unit_of_mesurement){
        this.uomChange(data.unit_of_mesurement)
      }

      if(data.material_type){
        this.typeChange(data.material_type)
      }
      if(data.material_cost_head){
        this.costheadChange(data.material_cost_head)
      }

      this.addMaterial.code=data.material_code;
      this.addMaterial.name=data.material_name;
      this.addMaterial.description=data.material_descriptions;
      this.addMaterial.mtype=data.material_type;
      this.addMaterial.msubtype=data.material_sub_type;
      this.addMaterial.costhead=data.material_cost_head;
      this.addMaterial.subcosthead=data.material_sub_cost_head;
      this.addMaterial.uom=data.unit_of_mesurement;
      this.addMaterial.seconduom=data.second_unit_applicability;
      this.addMaterial.nature=data.material_nature;
      this.addMaterial.leadtime=data.material_lead_time;
      this.addMaterial.valuation=data.material_valuation;
      this.addMaterial.tolerance=data.material_tolerance;
      this.addMaterial.wastage=data.material_wastage;
      this.addMaterial.shortclose=data.material_short_close_required;
      this.addMaterial.gstapplicable=data.gst_applicable;
      this.addMaterial.cgst=data.cgst_percentage;
      this.addMaterial.sgst=data.sgst_percentage;
      this.addMaterial.igst=data.igst_percentage;
      this.KeyScopesData=[];
      if(data.second_unit_of_mesurement.length!=0){
        for(let item of data.second_unit_of_mesurement){
          this.KeyScopesData.push({
            primary_rate: item.primary_rate,
            conversion_rate: item.conversion_rate,
            second_uom: item.second_uom
          });
        }
      }else{
        this.KeyScopesData.push({
          name: '',
        });
      }
      if(data.material_image){
        this.imageValue=environment.API_URL1 + data.material_image; 
        this.importData = data.material_image;
      }
    })
  }

  previewDoc(data:any) {
    window.open(data);
  }
  removeDoc(){
    this.importData='';
  }

  getMaterialType(){

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialTypeList(params).subscribe(data=>{
      this.materialTypeList=data.results;
    })
  }

  getMaterialCostHead(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialCostHeadList(params).subscribe(data=>{
      this.materialCostHeadList=data.results;
    })
  }

  getUOMData(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getUOMList(params).subscribe(data=>{
      this.uomList=data.results;
    })
  }

  getNaturePropertiesData(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getNature_PropertiesList(params).subscribe(data=>{
      this.naturePropertiesList=data.results;
    })
  }

  typeChange(typeid:any){
    this.addMaterial.msubtype='';
   let params = new URLSearchParams();
    params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialTypeList(params).subscribe(data=>{
      this.materialSubTypeList=data;
    })
  }

  costheadChange(costheadid:any){
    this.addMaterial.subcosthead='';
    let params = new URLSearchParams();
    params.set('id', costheadid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialCostHeadList(params).subscribe(data=>{
      this.materialSubCostHeadList=data;
    })
  }
  uomChange(uomId:any){
    this.addMaterial.seconduom='';
    let params = new URLSearchParams();
    params.set('id', uomId);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getUOMList(params).subscribe(data=>{
      this.secondUomList=data;
      this.prevuomList = data.symbol;
    })
  }

  uploadFile(event: any) {
    this.importData = event.target.files[0];   
  }
  addnewMaterial(){
    var form_data = new FormData();
    form_data.append('organization', this.localStorageData.organisation_details[0].id);
    form_data.append('material_name', this.addMaterial.name);
    form_data.append('material_code', this.addMaterial.code);
    form_data.append('material_descriptions', this.addMaterial.description);
    form_data.append('material_type', this.addMaterial.mtype);
    form_data.append('material_sub_type', this.addMaterial.msubtype);
    form_data.append('material_cost_head', this.addMaterial.costhead);
    form_data.append('material_sub_cost_head', this.addMaterial.subcosthead);
    form_data.append('unit_of_mesurement', this.addMaterial.uom);
    form_data.append('second_unit_applicability', this.addMaterial.seconduom);
    form_data.append('material_nature', this.addMaterial.nature);
    form_data.append('material_lead_time', this.addMaterial.leadtime);
    form_data.append('material_valuation', this.addMaterial.valuation);
    form_data.append('material_tolerance', this.addMaterial.tolerance);
    form_data.append('material_wastage', this.addMaterial.wastage);
    form_data.append('material_short_close_required', this.addMaterial.shortclose);
    form_data.append('gst_applicable', this.addMaterial.gstapplicable);
    form_data.append('cgst_percentage', this.addMaterial.cgst);
    form_data.append('sgst_percentage', this.addMaterial.sgst);
    form_data.append('igst_percentage', this.addMaterial.igst);
    form_data.append('second_uoms', JSON.stringify(this.KeyScopesData));

    if(this.prevValue.material_image==''){
      if (this.importData) {
        form_data.append('material_image', this.importData);
      } else {
        form_data.append('material_image', '');
      }
    }

    let params = new URLSearchParams();
    params.set('id', this.editingId);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'edit');


    if (this.addmaterialForm.valid) {
         this.apiservice.editMaterial(params,form_data).subscribe(data=>{
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          setTimeout(function(){
            window.location.reload();
         }, 2000);
        },err=>{
            this.toastrService.error(Error_Messages.Failed_HTTP, '', {
              timeOut: 2000,
            });
            this.parentFun.emit();
            this.afterAdd=false;
            this.KeyScopesData=[];
            this.KeyScopesData.push({
              conversion_rate: '',
              second_uom: '',
              primary_rate: ''
            });
         })
     }
    else {
      this.markFormGroupTouched(this.addmaterialForm);
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
