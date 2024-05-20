import { Component, EventEmitter, Output } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';

@Component({
  selector: 'app-edit-material-types',
  templateUrl: './edit-material-types.component.html',
  styleUrls: ['./edit-material-types.component.scss',
  '../../../../../../assets/scss/from-coomon.scss',
  '../../../../../../assets/scss/from-coomon.scss',
]

})
export class EditMaterialTypesComponent {

  @Output()
  parentFun = new EventEmitter<string>();
  wbsForm!: FormGroup;
  disablednow = true
  wbsName:any='';
  materialtype:any='';
  materialCode:any=''
  formalName:any='';
  conversion:any='';
  secondunit:any='';
  tenderId:any;
  localStorageData:any;
  editedId:any;
  afterAdd:boolean=false;
  pruductiontypeCheck:boolean=false;

  tolerancelevel:any='';
  purchaseAccount:any='';
  salesAccount:any='';
  itemtype:any='';
  gstTax:any='';
  parent:any='';
  productiontypeList:any='';
  companyList:any;
  accountNameList:any;
  itemTypelist:any;
  gstlist:any;
  productionTypeValue:any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private procurementAPIService:PROCUREMENTAPIService

   ) { 
    this.wbsForm = formBuilder.group({
      materialtype: ['', [Validators.required]],
      materialCode: [{value: '', disabled: true}, [Validators.required]],
      tolerancelevel:['', [Validators.required]],
      purchaseAccount:[''],
      salesAccount:[''],
      itemtype:[''],
      gstTax:[''],
      parent:[''],
      productiontypeList:['']
    })
   }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getItemType();
    this.getTaxHeadData();
    this.getProductionType();
    this.getAccount();
  }

  getAccount(){
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getAccountHead(params).subscribe(data => {
    this.accountNameList = data.results;
    });
  }

  getProductionType(){
    this.apiservice.getProductionType().subscribe(data=>{
      this.productionTypeValue=data.results;
    })
  }

  viewCompany() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.companyList = data.results;
      if(this.parent){
      this.companyList = this.companyList.filter((x:any)=>(x.id != this.editedId));
      }
    })
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      this.gstlist = data.results
    });
  }


  getItemType(){
    this.apiservice.getItemType().subscribe(data=>{
     this.itemTypelist=data.results;
    }) 
   }

  getData(editid :any){
    this.editedId=editid;
    let params = new URLSearchParams();
    params.set('id', editid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialtype=data.name;
      this.materialCode = data.code;
      this.tolerancelevel=data.tolerance_level;
      this.purchaseAccount= data.purchase_account;;
      this.salesAccount=data.sales_account;
      this.itemtype=data.item_type_details?.id;
      this.gstTax=data.gst_tax;
      this.productiontypeList=data.production_type_details?.id;
      this.pruductiontypeCheck=data.is_production_type;
      this.parent=data.parent;
      this.viewCompany();

    })
  }

  editWBS(){
    this.afterAdd=true;
    if (this.wbsForm.valid) {

      let params = new URLSearchParams();
      params.set('method', 'edit');
      params.set('id', this.editedId);
      params.set('organization_id',this.localStorageData.organisation_details[0].id);


    let request = {
      "organization":this.localStorageData.organisation_details[0].id,
      "name":this.materialtype,
      "code" : this.materialCode,
      "production_type":this.productiontypeList,
      "tolerance_level":this.tolerancelevel,
      "purchase_account":this.purchaseAccount,
      "sales_account":this.salesAccount,
      "item_type":this.itemtype,
      "gst_tax":this.gstTax,
      "parent":this.parent,
      "is_production_type":this.pruductiontypeCheck
    }
    this.apiservice.editMaterialTypeData(params,request).subscribe(data => {
      this.toastrService.success('Material Group Updated Successfully', '', {
        timeOut: 2000,
      });
      setTimeout(function(){
        window.location.reload();
     }, 2000);
    },err=>{
      if(err.error.msg){
        this.toastrService.error(err.error.msg, '', {
          timeOut: 2000,
        });
      }else{
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
      this.parentFun.emit();
      this.wbsForm.reset();
      this.afterAdd=false;
    })
  }
  else {
    this.markFormGroupTouched(this.wbsForm);
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


  generateKey() {
    let code = this.materialtype.split(' ')
    let codeREs = ''
    for(let i=0;i<code.length;i++) {
      codeREs += code[i][0]?.toUpperCase()
    }
    this.materialCode = codeREs
  }


}
