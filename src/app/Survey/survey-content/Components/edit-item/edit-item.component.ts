import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/survey-common.scss'
  ]
})
export class EditItemComponent implements OnInit {
  itemForm!: FormGroup;

  addItem: any = {
    Itemname: '',
    Gpsname: '',
    Locationname: '',
    Leadname: '',
  }

  constructor(
    private apiservice: APIService,
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) {
    this.itemForm = formBuilder.group({
      item_name: ['', [Validators.required]],
      gps: ['', [Validators.required]],
      location: ['', [Validators.required]],
      lead: ['', [Validators.required]],
    })
  }



  ngOnInit(): void {
  }

  submitItem() {
    if (this.itemForm.valid) {



    }
    else {
      this.markFormGroupTouched(this.itemForm);
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
