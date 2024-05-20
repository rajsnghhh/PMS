import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-sms-configuration',
  templateUrl: './add-sms-configuration.component.html',
  styleUrls: ['./add-sms-configuration.component.scss',
  '../../../../assets/scss/from-coomon.scss',
  '../../../../assets/scss/scrollableTable.scss']
})
export class AddSmsConfigurationComponent implements OnInit {

  caretPos: number = 0;

  addSmsForm! : FormGroup;
  localStorageData:any;
  templateList: any = [];
  tagList: any = [];

  addSms:any = {
    smsname : '',
    smsbody : '',
    Templatetype : '',
    Tagname : '',
  }

  constructor( 
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice:DataSharedService,
    private toastrService: ToastrService
    ) {
    this.addSmsForm = formBuilder.group({
      smsname: ['', Validators.required],
      smsbody: ['', Validators.required],
      Tagname: [''],
      Templatetype: ['', Validators.required],
    })
   }
  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getTemplate();
    this.getTagList();
  }

  getTagList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getSmsTag(params).subscribe(data => {
      this.tagList = data.results;
    })
  }

  getTemplate() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getsmsTemplateList(params).subscribe(data => {
      this.templateList = data.results;
    })
  }

  addnewSms() {
    if (this.addSmsForm.valid) {
      let body = {
        organization:this.localStorageData.organisation_details[0].id,
        sms_template_name: this.addSmsForm.value.smsname,
        body: this.addSmsForm.value.smsbody,
        template_type: this.addSmsForm.value.Templatetype,
        name: this.addSmsForm.value.Tagname,
      }
      this.apiservice.addSms(body, this.localStorageData.organisation_details[0].id).subscribe((data: any) => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        setTimeout(function(){
          window.location.reload();
       }, 2000);
      },err=>{
        if(err.error.error){
          this.toastrService.error(err.error.error, '', {
            timeOut: 2000,
          });
        }else{
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    } else {
      this.markFormGroupTouched(this.addSmsForm);
    }
  }

  getCaretPos(oField: any) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
    }
  }

  addToken(token: string) {
    const smsContent: string = this.addSmsForm.controls['smsbody'].value;

    if (this.caretPos >= 0) {
      const firstPart = smsContent.substring(0, this.caretPos);
      const secondPart = smsContent.substring(this.caretPos);

      const smsAndToken = `${firstPart} {{${token}}} ${secondPart}`;

      this.addSmsForm.controls['smsbody'].setValue(smsAndToken);
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
