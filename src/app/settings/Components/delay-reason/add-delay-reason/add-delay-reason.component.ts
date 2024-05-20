import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-delay-reason',
  templateUrl: './add-delay-reason.component.html',
  styleUrls: ['./add-delay-reason.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class AddDelayReasonComponent implements OnInit {

  adddepartmentForm!: FormGroup;
  localStorageData: any;
  departmentlist: any;
  OptionData: any[] = [];
  delay_breakups: any[] = [];


  addDepartment: any = {
    name: '',
    code: '',
    risktype: '',
    colorcode: ''
  }

  public color: string = '#fff';


  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) {
    this.adddepartmentForm = formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      risktype: ['', Validators.required],
      colorcode: ['', Validators.required],
    })
  }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.OptionData.push({
      option: ''
    });
  }

  addnewDelayreason() {

    for (let data of this.OptionData) {
      this.delay_breakups.push(data.option);
    }

    if (this.adddepartmentForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        delay_code: this.adddepartmentForm.value.code,
        reasons: this.adddepartmentForm.value.name,
        risk_type: this.adddepartmentForm.value.risktype,
        color_code: this.addDepartment.colorcode,
        delay_breakups: this.delay_breakups
      }
      this.apiservice.addDelayreason(body).subscribe((data: any) => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
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
      this.markFormGroupTouched(this.adddepartmentForm);
    }

  }

  colorChange(event: any) {
    this.addDepartment.colorcode = event;
  }

  nocolor() {
    this.addDepartment.colorcode = '';
    this.color='';
  }

  addOption() {
    this.OptionData.push({
      option: ''
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
