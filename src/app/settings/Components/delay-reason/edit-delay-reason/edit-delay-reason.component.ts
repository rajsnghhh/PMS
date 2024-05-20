import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-edit-delay-reason',
  templateUrl: './edit-delay-reason.component.html',
  styleUrls: ['./edit-delay-reason.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})

export class EditDelayReasonComponent implements OnInit {

  editDelayreasonForm!: FormGroup;
  localStorageData: any;
  editDelayreasonId: any;
  DelayreasonList:any[] = [];
  Delayreasonheadname: any = [];
  OptionData: any[] = [];
  delay_breakups:any[]=[];
  delayArray:any[]=[];

  addDepartment: any = {
    name: '',
    code: '',
    risktype:'',
    colorcode:''
  }

  public color: string = '#fff';

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService
  ) {
    this.editDelayreasonForm = formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      risktype:['',Validators.required],
      colorcode:['',Validators.required],
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  getData(id: string) {
    this.apiservice.getDelayreasondetails(this.localStorageData.organisation_details[0].id,id).subscribe(data => {
      this.DelayreasonList = data;

      this.addDepartment.name = data.reasons;
      this.addDepartment.code = data.delay_code;
      // this.addDepartment.code = this.DelayreasonList.find((e: { id: any | null; }) => e.id == id)?.delay_code;
      this.addDepartment.risktype = data.risk_type;
      this.addDepartment.colorcode = data.color_code;
      this.delayArray=data.breakup_details;


      if(this.addDepartment.colorcode){
        this.color=this.addDepartment.colorcode;
      }

    if(this.delayArray.length==0){
      this.OptionData=[];
      this.OptionData.push({
        option: '',
        id:''
      });
    }else{
      this.OptionData=[];
      for(let delay of this.delayArray){
        this.OptionData.push({
          option: delay.name,
          id:delay.id
        });
      }
    }

    })
  }

  editDelayreason() {

    for(let data of this.OptionData){
      let val={
        name:data.option,
        id:data.id
      }
      this.delay_breakups.push(val);
    }

    if (this.editDelayreasonForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        delay_code: this.editDelayreasonForm.value.code,
        reasons: this.editDelayreasonForm.value.name,
        risk_type: this.editDelayreasonForm.value.risktype,
        color_code:this.addDepartment.colorcode,
        delay_breakups:this.delay_breakups
      }

      let id = JSON.parse(this.datasharedservice.getLocalData('delayreason_id'));
      this.apiservice.editDelayreason(body, id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, err => {
        if (err.error.detail) {
          this.toastrService.error(err.error.detail, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    } else {
      this.markFormGroupTouched(this.editDelayreasonForm);
    }
  }

  colorChange(event:any){
    this.addDepartment.colorcode=event;
  }

  nocolor() {
    this.addDepartment.colorcode = '';
    this.color='';
  }

  addOption() {
    this.OptionData.push({
      option: '',
      id:''
    });
  }

  removeOption(rid: number) {
    this.OptionData.splice(rid, 1);

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

