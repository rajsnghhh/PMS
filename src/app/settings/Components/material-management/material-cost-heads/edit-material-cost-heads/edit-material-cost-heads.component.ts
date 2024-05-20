import { Component, EventEmitter, Output } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Error_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-edit-material-cost-heads',
  templateUrl: './edit-material-cost-heads.component.html',
  styleUrls: ['./edit-material-cost-heads.component.scss',
  '../../../../../../assets/scss/from-coomon.scss'
]
})

export class EditMaterialCostHeadsComponent {

  @Output()
  parentFun = new EventEmitter<string>();
  wbsForm!: FormGroup;

  KeyScopesData:any=[];
  wbsName:any='';
  materialtype:any='';
  formalName:any='';
  conversion:any='';
  secondunit:any='';
  tenderId:any;
  localStorageData:any;
  editedId:any;
  afterAdd:boolean=false;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder


   ) { 
    this.wbsForm = formBuilder.group({
      materialtype: ['', [Validators.required]],
    })
   }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

  }

  addKeyScope() {
    this.KeyScopesData.push({
      name: '',
    });
  }
  removeKeyScope(rid: number) {
    this.KeyScopesData.splice(rid, 1);
  }
  

  getData(editid :any){
    this.editedId=editid;
    let params = new URLSearchParams();
    params.set('id', editid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.apiservice.getMaterialCostList(params).subscribe(data => {
      this.materialtype=data.name;
      this.KeyScopesData=[];
      if(data.material_sub_cost_head.length!=0){
        for(let item of data.material_sub_cost_head){
          this.KeyScopesData.push({
            name: item.name,
          });
        }
      }else{
        this.KeyScopesData.push({
          name: '',
        });
      }
    })
  }

  editWBS(){
    this.afterAdd=true;
    if (this.wbsForm.valid) {

      let params = new URLSearchParams();
      params.set('method', 'edit');
      params.set('m_sub_cost_head_id', this.editedId);

    let request = {
      'organization_id':this.localStorageData.organisation_details[0].id,
      "name":this.materialtype,
      "m_sub_cost_heads":this.KeyScopesData
    }
    this.apiservice.editMaterialCostData(params,request).subscribe(data => {
      this.toastrService.success('Material Head Cost Updated Successfully', '', {
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
      this.KeyScopesData=[];
      this.KeyScopesData.push({
        name: '',
      });
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


}

