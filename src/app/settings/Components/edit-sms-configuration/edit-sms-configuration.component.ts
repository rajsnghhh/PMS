import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-edit-sms-configuration',
  templateUrl: './edit-sms-configuration.component.html',
  styleUrls: ['./edit-sms-configuration.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/scrollableTable.scss']
})
export class EditSmsConfigurationComponent implements OnInit {

  caretPos: number = 0;

  editsmsForm!: FormGroup;
  localStorageData: any;
  editDepartmentId: any;
  smsList: any = [];
  templateList: any = [];
  tagList: any = [];
  getsmsname: any = [];
  getsmsbody: any = [];
  gettagname: any = [];
  gettemplatetype: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService
  ) {
    this.editsmsForm = formBuilder.group({
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

  getsmsList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getSmsList(params).subscribe(data => {
      this.smsList = data.results;
    })
  }

  getData(id: string) {
    this.apiservice.getsmsDetails(this.localStorageData.organisation_details[0].id, id).subscribe(data => {
      this.smsList = data.results;
      this.getsmsname = this.smsList.find((e: { id: string | null; }) => e.id == id).sms_template_name;
      this.getsmsbody = this.smsList.find((e: { id: string | null; }) => e.id == id).body;
      this.gettemplatetype = this.smsList.find((e: { id: string | null; }) => e.id == id).template_type.id;
    })
  }

  editSms() {
    if (this.editsmsForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        sms_template_name: this.editsmsForm.value.smsname,
        body: this.editsmsForm.value.smsbody,
        template_type: this.editsmsForm.value.Templatetype,
        name: this.editsmsForm.value.Tagname,
      }
      let id = JSON.parse(this.datasharedservice.getLocalData('sms_id'));
      this.apiservice.editSms(body, id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
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
      this.markFormGroupTouched(this.editsmsForm);
    }
  }

  getCaretPos(oField: any) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
    }
  }

  addToken(token: string) {
    const smsContent: string = this.editsmsForm.controls['smsbody'].value;

    if (this.caretPos >= 0) {
      const firstPart = smsContent.substring(0, this.caretPos);
      const secondPart = smsContent.substring(this.caretPos);

      const smsAndToken = `${firstPart} {{${token}}} ${secondPart}`;

      this.editsmsForm.controls['smsbody'].setValue(smsAndToken);
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
