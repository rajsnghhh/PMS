import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: [
    './add-notification.component.scss',
    '../../../../../assets/scss/from-coomon.scss'
  ]
})
export class AddNotificationComponent implements OnInit {

  NotificationType = '';
  showNotificationTypeError = false;
  localStorageData: any;
  userList: any;
  selectedNodeID = ''
  EmailTemplateList: any;
  SmsTemplateList: any;
  dropdownUserList: any = [];
  dropdownUserSettings = {};
  addEmail: any = {
    selectedUser: [],
    ccuser: [],
    email_template_id: '',
    sms_template_id: '',
    trigger_type: '',
    date: '',
    title: ''
  }

  addNotificationForm!: FormGroup;
  @Output()
  parentFun = new EventEmitter<string>();

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {

    this.addNotificationForm = formBuilder.group({
      title: [[], [Validators.required]],
      selectedUser: [[], [Validators.required]],
      ccuser: [[], []],
      email_template_id: ['', []],
      sms_template_id: ['', []],
      trigger_type: ['', [Validators.required]],
      date: ['', []],
    })
  }

  getData(selectID: any) {
    this.selectedNodeID = selectID;
    this.NotificationType = ''
    this.getUserList();
    this.getEmailTemplateList();
    this.getSMSTemplateList();
  }

  changeDaTE() {
    if (this.addEmail.trigger_type == 'Set Date') {
      this.addEmail.date = ''
      this.addNotificationForm.controls['date'].setValidators([Validators.required]);
    } else {
      this.addEmail.date = new Date();
      this.addNotificationForm.controls['date'].clearValidators();
    }
  }

  changeTemplate() {
    if (this.NotificationType == 'EMAIL') {
      this.addNotificationForm.controls['email_template_id'].setValidators([Validators.required]);
      this.addNotificationForm.controls['sms_template_id'].clearValidators();
    }
    if (this.NotificationType == 'SMS') {
      this.addNotificationForm.controls['sms_template_id'].setValidators([Validators.required]);
      this.addNotificationForm.controls['email_template_id'].clearValidators();
    }
  }

  ngOnInit(): void {
    this.dropDownSettings()
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  dropDownSettings() {
    this.dropdownUserSettings = {
      singleSelection: false,
      disabled: false,
      text: "",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    }
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data

      this.dropdownUserList = []
      for (const item of this.userList) {
        var obj = {
          id: item.id,
          itemName: item.full_name
        }
        this.dropdownUserList.push(obj);
      }
    })
  }

  getEmailTemplateList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getEmailList(params).subscribe(data => {
      this.EmailTemplateList = data.results
    })
  }

  getSMSTemplateList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getSmsList(params).subscribe(data => {
      this.SmsTemplateList = data.results
    })
  }

  proceedNext() {
    if (this.NotificationType == '') {
      this.showNotificationTypeError = true
    } else {
      this.showNotificationTypeError = false
    }
  }

  addEmailNotification() {
    if (this.addNotificationForm.valid) {
      let to = []
      for (let i = 0; i < this.addEmail.selectedUser.length; i++) {
        to.push(this.addEmail.selectedUser[i].id)
      }
      let cc = []
      for (let i = 0; i < this.addEmail.ccuser.length; i++) {
        cc.push(this.addEmail.ccuser[i].id)
      }

      let request = {
        'organization': this.localStorageData.organisation_details[0].id,
        'tender_id': this.selectedNodeID,
        'email_template_id': this.addEmail.email_template_id,
        'title': this.addEmail.title,
        'sms_template_id': this.addEmail.sms_template_id,
        'notification_type': this.NotificationType,
        'trigger_type': this.addEmail.trigger_type,
        'date': this.addEmail.date,
        'to': to,
        'cc': cc,
        'sms_to': to
      }
      this.apiservice.addNewNotification(request).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.resetADD()
      }, err => {
        if (err.error.msg) {
          this.toastrService.error(err.error.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })

    } else {
      this.markFormGroupTouched(this.addNotificationForm);
    }
  }

  addSmsNotification() {

  }

  resetADD(): void {
    this.NotificationType = '';
    this.parentFun.emit();
    this.addEmail.selectedUser = [];
    this.addEmail.ccuser = [];
    this.addEmail.email_template_id = '';
    this.addEmail.sms_template_id = '';
    this.addEmail.trigger_type = '';
    this.addEmail.date = '';
    this.addEmail.title = '';
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: { markAsTouched: () => void; controls: any[]; }) => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach((c: FormGroup) => this.markFormGroupTouched(c));
      }
    });
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
      'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    };
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched);
  }
}
