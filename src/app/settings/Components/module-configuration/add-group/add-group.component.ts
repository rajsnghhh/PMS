import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss',
  '../../../../../assets/scss/from-coomon.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class AddGroupComponent implements OnInit {
  addGroup:any = {
    groupname : '',
    value_type:''
  }
  GroupForm!: FormGroup;
  viewType:any;
  is_skippable:any=false;
  is_multipl:any=false;
  localStorageData:any;
  tyofForm:any;

  selectedRole:any=[];
  roleIdArray:any=[];
  dropdownRoleSettings:any={};
  dropdownRolelist:any=[];

  constructor(
    private apiservice: APIService,
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService ) 
    {
    this.GroupForm = formBuilder.group({
      group_name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      value_type:['']
    })
   }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.multiselectValue();
    this.setupMultiSelectOptions();
  }

  setupMultiSelectOptions() {
    this.dropdownRoleSettings = {
      singleSelection: false,
      text: "Select Action Role",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    }

  }
  multiselectValue(){
    this.apiservice.getModulePermissionMenuLIST().subscribe(data => {
      this.dropdownRolelist=[];
      for (const item of data) {
        var obj = {
          id: item.id,
          itemName: item.name
        }
        this.dropdownRolelist.push(obj);
      }
    })

  }
  prevData(grId:any){
    this.tyofForm=grId;
  }
  addNewGroup(){
    if (this.GroupForm.valid) {  
      for (const item of this.selectedRole) {
        this.roleIdArray.push(item.id);
      }
      if(this.GroupForm.value.value_type==''){
        this.viewType='NORMAL';
      }else{
        this.viewType=this.GroupForm.value.value_type;
      }
      let data={
        organization:this.localStorageData.organisation_details[0].id,
        form_type:this.tyofForm,
        permissible_user_types:this.roleIdArray,
        name:this.GroupForm.value.group_name,
        value_type:this.viewType,
        is_skipable:this.is_skippable,
        is_multiple:this.is_multipl
      }

      this.apiservice.postDynamicForm(data).subscribe(data => {
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
    }
    else {
      this.markFormGroupTouched(this.GroupForm);
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
