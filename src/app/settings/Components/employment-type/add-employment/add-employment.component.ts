import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/Shared/Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';


@Component({
  selector: 'app-add-employment',
  templateUrl: './add-employment.component.html',
  styleUrls: ['./add-employment.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class AddEmploymentComponent implements OnInit {
 
  addEmployeeForm!: FormGroup;
  localStorageData:any;

  addEmployee:any = {
    name : '',
  }


  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private datasharedservice:DataSharedService
  ) {
    this.addEmployeeForm = formBuilder.group({
      name: ['', Validators.required],
    })
   }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

addnewEmployee(){
  if (this.addEmployeeForm.valid) {
    let body = {
      organization: this.localStorageData.organisation_details[0].id,
      user_type: this.addEmployeeForm.value.name,
    }
    this.apiservice.addemployee(body).subscribe((data: any) => {
      this.toastrService.success(Success_Messages.SuccessAdd, '', {
        timeOut: 2000,
      });
      setTimeout(function(){
        window.location.reload();
     }, 2000);
    },err=>{
      if(err.error.detail){
        this.toastrService.error(err.error.detail, '', {
          timeOut: 2000,
        });
      }else{
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
  })
  } else {
    this.markFormGroupTouched(this.addEmployeeForm);
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
