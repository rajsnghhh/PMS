import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

declare var window: any;



@Component({
  selector: 'app-edit-employement',
  templateUrl: './edit-employement.component.html',
  styleUrls: ['./edit-employement.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class EditEmployementComponent implements OnInit {

  editemployementForm!: FormGroup;
  localStorageData:any;
  editemployementId:any;
  employementList: any = [];
  employementname: any;

  constructor( private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice:DataSharedService,
    private toastrService: ToastrService
  ) {
    this.editemployementForm = formBuilder.group({
      name: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  getData(id:string) {
    this.apiservice.getEmployeeDetails(this.localStorageData.organisation_details[0].id,id).subscribe(data => {
      this.employementList = data.results;
      this.employementname =  this.employementList.find((e: { id: string | null; }) => e.id == id).user_type;
    })
  }

  editemployement() {
    if (this.editemployementForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        user_type: this.editemployementForm.value.name,
      }
      let id = JSON.parse(this.datasharedservice.getLocalData('employement_id'));
      this.apiservice.editEmployee(body, id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        if(res.status==400){
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
      this.markFormGroupTouched(this.editemployementForm);
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
