import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Output("parentCompFun")
  parentCompFun: EventEmitter<any> = new EventEmitter();

  adddeviationForm!: FormGroup;
  yearChangeForm!: FormGroup;
  attendanceId: any;
  attendanceList: any = [];
  monthList: any = [];
  list: any = 0;
  default = false;
  fortnightData: any = [];
  localStorageData: any;
  localStorage: any;
  activeSession: any;
  stdate: any;
  EDate: any;
  SDate: any;
  indexValue: any;
  currentYear = new Date().getFullYear();

  addDevition: any = {
    StartTime: '',
    EndTime: '',
    Justification: '',
  }
  strdate: any;
  endate: any;
  selectedyear: any = this.currentYear;

  constructor(
    private apiservice: HRMSAPIService,
    private router: Router,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private formBuilder: FormBuilder,
  ) {
    this.adddeviationForm = formBuilder.group({
      deviationType: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      justification: ['', Validators.required],
    })
    this.yearChangeForm = formBuilder.group({
      year: [''],
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.activeSession = JSON.parse(this.datasharedservice.getLocalData('activeSession'));
    this.indexValue = this.activeSession.SprintDataIndex;
    this.SDate = this.activeSession.SprintData.fortnight_start_date;
    if (this.activeSession.SprintData.second_fortnight_end == '') {
      this.EDate = this.activeSession.SprintData.fortnight_end_date;

    } else {
      this.EDate = this.activeSession.SprintData.second_fortnight_end;
    }
    this.viewAttendance(this.SDate, this.activeSession.SprintData.fortnight_end_date, this.activeSession.SprintData.second_fortnight_end, this.indexValue);
    this.monthsList();
  }

  yearChange() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('year', this.yearChangeForm.value.year);
    this.apiservice.getmonthList(params).subscribe(data => {
      this.monthList = data.result;
      this.viewAttendance(this.monthList[0].fortnight_start_date, this.monthList[0].fortnight_end_date, this.monthList[0].second_fortnight_end, this.indexValue)
    })
    this.indexValue = 0;
  }

  monthsList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('year', this.activeSession.SprintYear);
    this.apiservice.getmonthList(params).subscribe(data => {
      this.monthList = data.result;
    })
  }

  AttendanceClick(StartDate: any, EndDate: any, secondEnd: any, index: any) {
    this.default = true;
    this.viewAttendance(StartDate, EndDate, secondEnd, index)
  }

  viewAttendance(StartDate: any, EndDate: any, secondEnd: any, index: any) {
    this.strdate = StartDate;

    if (secondEnd == '') {
      this.endate = EndDate;
    } else {
      this.endate = secondEnd;

    }
    this.indexValue = index;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('start_date', StartDate);
    params.set('end_date', EndDate);
    this.apiservice.getattendenceList(params).subscribe(data => {
      this.attendanceList = data.result;
    })
    if (this.default == true) {
      this.parentCompFun.emit(this.monthList[index]);
    }
  }

  createdeviation(id: any) {
    this.attendanceId = id;
  }

  addDeviation() {
    if (this.adddeviationForm.valid) {
      if (this.adddeviationForm.value.startTime > this.adddeviationForm.value.endTime) {
        this.toastrService.error('Start Time must be before End Time', '', {
          timeOut: 2000,
        });
      } else if (this.adddeviationForm.value.startTime == this.adddeviationForm.value.endTime) {
        this.toastrService.error('Start Time and End Time Should Not be Same', '', {
          timeOut: 2000,
        });
      } else {
        let body = {
          attendence_id: this.attendanceId,
          deviation_type: this.adddeviationForm.value.deviationType,
          start_time: this.adddeviationForm.value.startTime + ':01',
          end_time: this.adddeviationForm.value.endTime + ':01',
          justifications: this.adddeviationForm.value.justification,
        }
        this.apiservice.adddeviation(body).subscribe((data: any) => {
          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.success(Success_Messages.SuccessAdd, '', {
              timeOut: 2000,
            });
            this.viewAttendance(this.SDate, this.activeSession.SprintData.fortnight_end_date, this.activeSession.SprintData.second_fortnight_end, this.indexValue);
          }
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
      }
    } else {
      this.markFormGroupTouched(this.adddeviationForm);
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
