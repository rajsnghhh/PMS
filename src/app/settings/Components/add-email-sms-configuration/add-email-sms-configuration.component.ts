import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { NgForm } from '@angular/forms';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import * as ClassicEditor from '../../../../app/ckeditor5/build/ckeditor';

@Component({
  selector: 'app-add-email-sms-configuration',
  templateUrl: './add-email-sms-configuration.component.html',
  styleUrls: ['./add-email-sms-configuration.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddEmailSmsConfigurationComponent implements OnInit {

  @ViewChild("ckEditorContent") ckEditorContent!: AddEmailSmsConfigurationComponent;
  editorInstance: any;
  adddemailtemplateForm!: FormGroup;
  localStorageData: any;
  templateList: any = [];
  tagList: any = [];
  tagName: any;
  Editor: any = ClassicEditor
  model: any = {
    editorData: '<p>Hello Create your template</p>'
  }

  addEmailTemplate: any = {
    Templatename: '',
    Fromemail: '',
    Fromname: '',
    Templatetype: '',
    Tagtype: '',
    Subject: '',
    Body: ''
  }


  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) {
    this.adddemailtemplateForm = formBuilder.group({
      Templatename: ['', Validators.required],
      Fromemail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      Fromname: ['', Validators.required],
      Templatetype: ['', Validators.required],
      Tagtype: [''],
      Subject: ['', Validators.required],
      Body: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getTagList();
    this.getTemplate();
  }

  onClickTag(tag: any) {
    const appendData = ' {{' + tag + '}} ';
    const selection = this.ckEditorContent.editorInstance.model.document.selection;
    const range = selection.getFirstRange();
    this.ckEditorContent.editorInstance.model.change((writer: { insert: (arg0: string, arg1: any) => void; }) => {
      writer.insert(appendData, range.start);
    });
  }
  getTemplate() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getTemplateList(params).subscribe(data => {
      this.templateList = data.results;
    })
  }

  getTagList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getEmailTag(params).subscribe(data => {
      this.tagList = data.results;
    })
  }

  addnewEmailSmsTemplate() {
    if (this.adddemailtemplateForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        template_name: this.adddemailtemplateForm.value.Templatename,
        subject: this.adddemailtemplateForm.value.Subject,
        body: btoa(JSON.stringify(this.adddemailtemplateForm.value.Body)),
        from_name: this.adddemailtemplateForm.value.Fromname,
        from_email: this.adddemailtemplateForm.value.Fromemail,
        template_type: this.adddemailtemplateForm.value.Templatetype,
        tags: this.adddemailtemplateForm.value.Tagtype
      }
      this.apiservice.addEmail(body, this.localStorageData.organisation_details[0].id).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
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
      this.markFormGroupTouched(this.adddemailtemplateForm);
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

  onReady(editor: any) {
    
  }
}
