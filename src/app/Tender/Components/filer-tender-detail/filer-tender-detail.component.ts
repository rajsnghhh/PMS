import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-filer-tender-detail',
  templateUrl: './filer-tender-detail.component.html',
  styleUrls: ['./filer-tender-detail.component.scss',
  '../../../../assets/scss/from-coomon.scss',
  '../../../../assets/scss/survey-common.scss'
]
})
export class FilerTenderDetailComponent implements OnInit {

  filterForm!: FormGroup;

  floatTender:any = {
    Status : '',
    Sdate : '',
    Edate : '',
    Eligibility : '',
    Biddertype : '',
  }


  constructor(
    private apiservice: APIService,
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) { 
    this.filterForm = formBuilder.group({
      status: ['', [Validators.required]],
      startdate: ['', [Validators.required]],
      enddate: ['', [Validators.required]],
      eligibility: ['', [Validators.required]],
      biddertype: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  tenderFilter() {
    if (this.filterForm.valid) {



    }
    else {
      this.markFormGroupTouched(this.filterForm);
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
