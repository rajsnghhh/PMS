import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-filter-tender',
  templateUrl: './filter-tender.component.html',
  styleUrls: ['./filter-tender.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class FilterTenderComponent implements OnInit {

  filterForm!: FormGroup;

  floatTender:any = {
    Dept : '',
    Fyear : '',
    Period : '',
    Division : '',
  }

  constructor(
    private apiservice: APIService,
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) { 
    this.filterForm = formBuilder.group({
      department: ['', [Validators.required]],
      financialyear: ['', [Validators.required]],
      period: ['', [Validators.required]],
      division: ['', [Validators.required]],
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
