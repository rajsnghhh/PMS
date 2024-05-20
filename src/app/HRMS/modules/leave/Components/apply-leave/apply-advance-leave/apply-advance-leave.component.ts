import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-apply-advance-leave',
  templateUrl: './apply-advance-leave.component.html',
  styleUrls: ['./apply-advance-leave.component.scss',
  ]
})
export class ApplyAdvanceLeaveComponent {

  ActiveClass: any = 'advance';
  userData: any;
  currentDate: any;
  leaveList: any;
  uploadFileData: any = '';
  uploadSpecialFileData: any = '';
  advanceLeaveForm: FormGroup;
  specialLeaveForm: FormGroup;



  constructor(
    private formBuilder: FormBuilder,
    private hrmsapiservice: HRMSAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,

  ) {
    this.advanceLeaveForm = formBuilder.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      leavetype: ['', Validators.required],
      leavereason: ['', Validators.required],
    })
    this.specialLeaveForm = formBuilder.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      leavetype: ['', Validators.required],
      leavereason: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    this.currentDate = this.getMonthValue(year + "-" + month + "-" + day);
    this.getData();
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

  }

  getMonthValue(month: any) {
    let date = month.split('-');
    let res = ''
    res += date[0] + '-'
    if (date[1].length < 2) {
      res += '0' + date[1] + '-'
    } else {
      res += date[0] + '-'
    }
    if (date[2].length < 2) {
      res += '0' + date[2]
    } else {
      res += date[2]
    }
    return res
  }

  getData() {
    let data = ''
    this.hrmsapiservice.getLeaveDetails(data).subscribe(data => {
      this.leaveList = data;
    })
  }

  onTab(data: any) {
    this.ActiveClass = data;
  }

  uploadAdvanceLeaveFile(event: any) {
    this.uploadFileData = event.target.files[0];
    this.toastrService.success('File Added', '', {
      timeOut: 2000,
    });
  }
  uploadSpecialFile(event: any) {
    this.uploadSpecialFileData = event.target.files[0];
    this.toastrService.success('File Added', '', {
      timeOut: 2000,
    });

  }
  advanceLeaveSubmit() {
    if (this.advanceLeaveForm.valid) {
      let params: any = {
        "employee": this.userData.user_id,
        "start_date": this.advanceLeaveForm.value.start_date,
        "end_date": this.advanceLeaveForm.value.end_date,
        "leave_type": this.advanceLeaveForm.value.leavetype,
        "reason": this.advanceLeaveForm.value.leavereason,
        "status": 'P',
        "category": 'N',
        "document": this.uploadFileData
      }

      var form_data = new FormData();
      for (var key in params) {
        form_data.append(key, params[key]);
      }
      this.hrmsapiservice.addLeave(form_data).subscribe(data => {
        this.toastrService.success('Leave Added Successfully', '', {
          timeOut: 2000,
        });
        this.getData();
        this.ActiveClass='applied';
      })
    } else {
      this.markFormGroupTouched(this.advanceLeaveForm);
    }
  }
  specialLeaveSubmit() {
    if (this.specialLeaveForm.valid) {
      let params: any = {
        "employee": this.userData.user_id,
        "start_date": this.specialLeaveForm.value.start_date,
        "end_date": this.specialLeaveForm.value.end_date,
        "leave_type": this.specialLeaveForm.value.leavetype,
        "reason": this.specialLeaveForm.value.leavereason,
        "status": 'P',
        "category": 'S',
        "document": this.uploadSpecialFileData
      }

      var form_data = new FormData();
      for (var key in params) {
        form_data.append(key, params[key]);
      }
      this.hrmsapiservice.addLeave(form_data).subscribe(data => {
        this.toastrService.success('Leave Added Successfully', '', {
          timeOut: 2000,
        });
        this.getData();
        this.ActiveClass='applied';
      })
    } else {
      this.markFormGroupTouched(this.specialLeaveForm);
    }
  }

  leaveDocView(doclink:any){
    window.open(doclink, "_blank");
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
