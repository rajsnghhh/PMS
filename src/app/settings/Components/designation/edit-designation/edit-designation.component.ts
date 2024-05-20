import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-edit-designation',
  templateUrl: './edit-designation.component.html',
  styleUrls: ['./edit-designation.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class EditDesignationComponent implements OnInit {
  editdesignationForm!: FormGroup;
  localStorageData:any;
  editdesignationId:any;
  designationList: any = [];
  designationname: any;
  descriptionname: any;
  parrentid:any;
  roleListValue:any;
  selected_Comaony = ''
  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice:DataSharedService,
    private toastrService: ToastrService
  ) { 
    this.editdesignationForm = formBuilder.group({
      name: ['', Validators.required],
      roleid: ['', Validators.required],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  getData(id:string,companyID:any) {
    this.selected_Comaony = companyID
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('company_id', companyID);
    params.set('id', id);
    params.set('edit', 'true');
    this.apiservice.getDesignationDetails(params).subscribe(data => {
      this.roleListValue = data.results;
    })

    let params2 = new URLSearchParams();
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('company_id', companyID);
    params2.set('id', id);
    this.apiservice.getDesignationDetails(params2).subscribe(data => {
      this.designationname =  data.designation;
      this.descriptionname =  data.description;
      this.parrentid = data.parent_id;
    })
  }

  editdesignation() {
    if (this.editdesignationForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        designation: this.editdesignationForm.value.name,
        description: this.editdesignationForm.value.description,
        parent_id:this.editdesignationForm.value.roleid,
        company:this.selected_Comaony
      }
      
      let id = JSON.parse(this.datasharedservice.getLocalData('designation_id'));
      this.apiservice.editDesignation(body, id, this.localStorageData.organisation_details[0].id,this.selected_Comaony).subscribe((res: any) => {
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
      this.markFormGroupTouched(this.editdesignationForm);
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

