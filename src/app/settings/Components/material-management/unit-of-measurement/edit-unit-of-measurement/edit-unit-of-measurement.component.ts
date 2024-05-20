import { Component, EventEmitter, Output } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Error_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-edit-unit-of-measurement',
  templateUrl: './edit-unit-of-measurement.component.html',
  styleUrls: ['./edit-unit-of-measurement.component.scss',
  '../../../../../../assets/scss/from-coomon.scss']

})
export class EditUnitOfMeasurementComponent {

  @Output()
  parentFun = new EventEmitter<string>();
  wbsForm!: FormGroup;

  KeyScopesData:any=[];
  wbsName:any='';
  symbol:any='';
  formalName:any='';
  decimal_places:any='';
  formula_for_qty_calculation:any='';
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
      symbol: ['', [Validators.required]],
      formalName: ['', [Validators.required]],
      decimal_places: ['',],
      formula_for_qty_calculation: ['',],
    })
   }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

  }

  addKeyScope() {
    this.KeyScopesData.push({
      conversion_rate: '',
      second_uom: ''
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

    this.apiservice.getUOMList(params).subscribe(data => {
      this.symbol=data.symbol;
      this.formalName=data.formal_name;
      this.decimal_places=data.decimal_places;
      this.formula_for_qty_calculation=data.formula_for_qty_calculation;
      this.KeyScopesData=[];
      if(data.second_unit_of_mesurement.length!=0){
        for(let item of data.second_unit_of_mesurement){
          this.KeyScopesData.push({
            conversion_rate: item.conversion_rate,
            second_uom: item.second_uom
          });
        }
      }else{
        this.KeyScopesData.push({
          conversion_rate: '',
          second_uom: ''
        });
      }
    })
  }

  editWBS(){
    this.afterAdd=true;
    if (this.wbsForm.valid) {

      let params = new URLSearchParams();
      params.set('method', 'edit');
      params.set('uom_id', this.editedId);

    let request = {
      'organization_id':this.localStorageData.organisation_details[0].id,
      "symbol":this.symbol,
      "formal_name":this.formalName,
      "decimal_places":this.decimal_places,
      "formula_for_qty_calculation":this.formula_for_qty_calculation,
      "second_uoms":this.KeyScopesData
    }
    this.apiservice.editUOMData(params,request).subscribe(data => {
      this.toastrService.success('UOM Updated Successfully', '', {
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
        conversion_rate: '',
        second_uom: ''
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
