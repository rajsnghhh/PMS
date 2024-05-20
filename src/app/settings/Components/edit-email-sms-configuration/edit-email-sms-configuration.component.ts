import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import * as ClassicEditor from '../../../../app/ckeditor5/build/ckeditor';

@Component({
  selector: 'app-edit-email-sms-configuration',
  templateUrl: './edit-email-sms-configuration.component.html',
  styleUrls: ['./edit-email-sms-configuration.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class EditEmailSmsConfigurationComponent implements OnInit {

  @ViewChild("ckEditorContent") ckEditorContent!: EditEmailSmsConfigurationComponent;
  editorInstance: any;
  editEmailTemplateForm!: FormGroup;
  localStorageData: any;
  tagList: any = [];
  emailList: any = [];
  gettemplatename: any = [];
  getfromemail: any = [];
  getfromname: any = [];
  getTemplatetype: any = [];
  getSubject: any = [];
  getBody: any = [];
  templateList: any = [];
  getTagtype: any = [];


  Editor: any = ClassicEditor;
  model: any = {
    editorData: '<p>Hello Create your template</p>'
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) {
    this.editEmailTemplateForm = formBuilder.group({
      Templatename: ['', Validators.required],
      Fromemail: ['', Validators.required],
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

  getEmailList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getEmailList(params).subscribe(data => {
      this.emailList = data.results;
    })
  }

  getData(id: string) {
    this.apiservice.getEmailListDetails(this.localStorageData.organisation_details[0].id, id).subscribe(data => {
      this.emailList = data.results;
      this.gettemplatename = this.emailList.template_name;
      this.getfromemail = this.emailList.from_email;
      this.getfromname = this.emailList.from_name;
      this.getTagtype = this.emailList.tags[0]?.name;
      this.getSubject = this.emailList.subject;
      this.getBody = JSON.parse(atob(this.emailList.body));
      this.getTemplatetype = this.emailList.email_template_type.id;
    })
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


  editEmailSmsTemplate() {
    if (this.editEmailTemplateForm.valid) {
      let body = {
        organization:this.localStorageData.organisation_details[0].id,
        template_name: this.editEmailTemplateForm.value.Templatename,
        subject: this.editEmailTemplateForm.value.Subject,
        body: btoa(JSON.stringify(this.editEmailTemplateForm.value.Body)),
        from_email: this.editEmailTemplateForm.value.Fromemail,
        from_name: this.editEmailTemplateForm.value.Fromname,
        template_type: this.editEmailTemplateForm.value.Templatetype,
        tags: this.editEmailTemplateForm.value.Tagtype,
      }

      let id = JSON.parse(this.datasharedservice.getLocalData('email_id'));
      this.apiservice.editEmail(body, id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        if(res.status == 400) {
          this.toastrService.error(res.msg, '', {
            timeOut: 2000,
          });
        }else{
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          setTimeout(function(){
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
      this.markFormGroupTouched(this.editEmailTemplateForm);
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

  onClickTag(tag: any) {
    const appendData = ' {{' + tag + '}} ';
    const selection = this.ckEditorContent.editorInstance.model.document.selection;
    const range = selection.getFirstRange();
    this.ckEditorContent.editorInstance.model.change((writer: { insert: (arg0: string, arg1: any) => void; }) => {
      writer.insert(appendData, range.start);
    });
  }
}
