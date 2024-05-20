import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class EditDepartmentComponent implements OnInit {
  editDepartmentForm!: FormGroup;
  localStorageData:any;
  editDepartmentId:any;
  departmentList: any = [];
  departmentname: any = [];
  departmentheadname: any = [];
  departmentlist: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private datasharedservice:DataSharedService
    ) { 
      this.editDepartmentForm = formBuilder.group({
        name: ['', Validators.required],
        depthead: ['', Validators.required]
      })
    }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getdepartmentHead();
  }

  getdepartmentHead() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getdeptHeadList(params).subscribe(data => {
      this.departmentlist = data;
    })
  }
  getData(id:string) {
    this.apiservice.getDepartmentDetails(this.localStorageData.organisation_details[0].id,id).subscribe(data => {
      this.departmentList = data.results;
      this.departmentname = this.departmentList.find((e: { id: string | null; }) => e.id == id).department;
      this.departmentheadname = this.departmentList.find((e: { id: string | null; }) => e.id == id).department_head;
    })
  }

  editDepartment() {
    if (this.editDepartmentForm.valid) {
      let body = {
        organization:this.localStorageData.organisation_details[0].id,
        department: this.editDepartmentForm.value.name,
        department_head: this.editDepartmentForm.value.depthead
      }

      let id = JSON.parse(this.datasharedservice.getLocalData('department_id'));
      this.apiservice.editDepartment(body, id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
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
      this.markFormGroupTouched(this.editDepartmentForm);
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
