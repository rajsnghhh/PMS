import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-user-event',
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.scss',
  '../../../../../../../assets/scss/from-coomon.scss'
]
})
export class UserEventComponent implements OnInit {
  @Output()
  parentFun = new EventEmitter<string>();
  conformationEventForm!: FormGroup;
  NotificationType = '';
  EmailTemplateList: any;
  ccToUserId:any=[];
  SelectToUserId:any=[];
  status:any='True';
  notify:any='False';
  remind:any='False';
  SmsTemplateList: any;
  showNotificationTypeError = false;
  addConformtion: any = {
    selectedUser: [],
    ccuser: [],
    sms_template_id: '',
    trigger_type: '',
    email_template_id:'',
    priority:'',
    event_name: '',
    event_descriptions : '',
    start_date: '',
    end_date:'',
    send_reminder_in_hours:''
  }
  userList: any;
  localStorageData:any;
  dropdownUserList: any = [];
  dropdownUserSettings:any = {}

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.conformationEventForm = formBuilder.group({
      event_name: ['', [Validators.required]],
      event_descriptions: [''],
      start_date: [''],
      end_date: [''],
      selectedUser: [[],],
      ccuser: [[], []],
      email_template_id:[''],
      sms_template_id: ['', []],
      trigger_type: [''],
      send_reminder_in_hours:[''],
      priority:['',[Validators.required]]
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.dropDownSettings();
    this.getEmailTemplateList();
    this.getSMSTemplateList();
    this.getUserList();
  }

  changeTemplate() {
    if (this.NotificationType == 'EMAIL') {
      this.conformationEventForm.controls['email_template_id'].setValidators([Validators.required]);
      this.conformationEventForm.controls['sms_template_id'].clearValidators();
    }
    if (this.NotificationType == 'SMS') {
      this.conformationEventForm.controls['sms_template_id'].setValidators([Validators.required]);
      this.conformationEventForm.controls['email_template_id'].clearValidators();
    }
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

 

  changeDaTE() {
    if (this.addConformtion.trigger_type == 'Set Date') {
      this.addConformtion.date = ''
      this.conformationEventForm.controls['start_date'].setValidators([Validators.required]);
      this.conformationEventForm.controls['end_date'].setValidators([Validators.required]);

    } else {
      this.addConformtion.start_date = 0;
      this.addConformtion.end_date = 0;
      this.conformationEventForm.controls['start_date'].clearValidators();
      this.conformationEventForm.controls['end_date'].clearValidators();
    }
  }

  addConformationEvent() {
    if(this.notify == 'False'){
      this.ccToUserId=[];
      this.SelectToUserId=[];
      this.addConformtion.start_date=null;
      this.addConformtion.end_date=null;
      this.addConformtion.trigger_type='';
      this.NotificationType='';
      this.addConformtion.email_template_id='';
      this.addConformtion.sms_template_id='';
    }

    for(let user of this.addConformtion.ccuser){
       this.ccToUserId.push(user.id);
    }
    for(let userto of this.addConformtion.selectedUser){
      this.SelectToUserId.push(userto.id);
   }
    if (this.NotificationType == '') {
      this.showNotificationTypeError = true
    } else {
      this.showNotificationTypeError = false
    }
    if(this.addConformtion.send_reminder_in_hours==''){
      this.addConformtion.send_reminder_in_hours=0;
    }
    if (this.conformationEventForm.valid) {
      {
        let body={
        event_type:this.datasharedservice.getLocalData('getEventType'),
        organization:this.localStorageData.organisation_details[0].id,
        tender_id :this.datasharedservice.getLocalData('tenderNodeId'), 
        event_name :this.conformationEventForm.value.event_name, 
        event_descriptions :this.conformationEventForm.value.event_descriptions,
        start_hour :this.addConformtion.start_date, 
        end_hour :this.addConformtion.end_date, 
        status :this.status, 
        send_reminder_in_hours:this.addConformtion.send_reminder_in_hours,
        priority:this.addConformtion.priority, 
        notify_assignee: this.notify, 
        remind_assignee:this.remind,
        event_trigger_type :this.addConformtion.trigger_type,
        cc_to :this.ccToUserId,
        assignees:this.SelectToUserId,
        event_notification_type:this.NotificationType, 
        email_template_id :this.addConformtion.email_template_id, 
        sms_template_id:this.addConformtion.sms_template_id, 
        }
        this.apiservice.postTenderEvents(body).subscribe(data=>{
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
          this.resetWorkFlow();
        }, err => {
          if (err.error.msg) {
            this.toastrService.error(err.error.msg, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.error(Error_Messages.Failed_HTTP, '', {
              timeOut: 2000,
            });
          }        })
      }

    }else {
      this.markFormGroupTouched(this.conformationEventForm);
    }
  }

  resetWorkFlow(): void {
    this.NotificationType = '';
    this.parentFun.emit();
    this.addConformtion.selectedUser = [];
    this.addConformtion.ccuser = [];
    this.addConformtion.email_template_id = '';
    this.addConformtion.sms_template_id = '';
    this.addConformtion.trigger_type = '';
    this.addConformtion.priority = '';
    this.addConformtion.event_name = '';
    this.addConformtion.event_descriptions = '';
    this.addConformtion.start_date = '';
    this.addConformtion.end_date = '';
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
