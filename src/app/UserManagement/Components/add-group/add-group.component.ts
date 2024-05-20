import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';



@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: [
    './add-group.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class AddGroupComponent implements OnInit {

  dropdownMultiSelectAddGroupSettings={};
  dropdownMultiselectAddGroupList:any=[];
  selectedMultipleData:any=[];
  localStorageData:any;
  userList:any;
  userData: any;
  groupForm!: FormGroup;
  userArray:any=[];
  addGrop:any = {
    group_name : '',
  }


  queryParaMap = {
    page_size : 10,
    page : 1,
    organisation : ''
  }

  constructor(
    private apiservice:APIService,
    private toastrService:ToastrService,
    private commonFunction:CommonFunctionService,
    private datasharedservice:DataSharedService,
    private formBuilder: FormBuilder

  ) {
    this.groupForm = formBuilder.group({
      group_name: ['', [Validators.required]],
      member: ['', [Validators.required]]
    })
   }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.queryParaMap.organisation = this.userData.organisation_details[0].id;
    this.userListData();
    this.setupMultiSelectOptions();
  }
  
  userListData(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data=> {
      for(let i=0;i<data.length;i++) {
        data[i].last_name = ''
        data[i].first_name = data[i].full_name
      }
      this.userList = data;
      this.showMultiStateSelect();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  showMultiStateSelect() {
    this.dropdownMultiselectAddGroupList=[];
    for (const item of this.userList) {
      var obj = {
        id: item.id,
        itemName: item.first_name +' '+ item.last_name
      }
      this.dropdownMultiselectAddGroupList.push(obj);
    }
  }

  addGroup(){
    if (this.groupForm.valid) {
      let req = {
        group_name: this.groupForm.value.group_name,
        organization: this.localStorageData.organisation_details[0].id,
        user_ids:this.userArray
      }
      this.apiservice.addGroupList(req).subscribe(data => {
        if(data.status==201){
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
          setTimeout(function(){
            window.location.reload();
         }, 2000);
        }else{
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        }
       
      },err=>{
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      })
    }
    else {
      this.markFormGroupTouched(this.groupForm);
    }
  }

  setupMultiSelectOptions() {
    this.dropdownMultiSelectAddGroupSettings = {
      singleSelection: false,
      text: "Select Member",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }

  onMultiSelectAddGroup(item: any) {
  this.userArray.push(item.id)
  }
  OnMultiDeSelectAddGroup(item: any) {
    const index: number = this.userArray.indexOf(item.id);
    if (index !== -1) {
      this.userArray.splice(index, 1);
    } 
  }
  onMultiSelectAddGroupAll(items: any) {
    this.userArray=[];
    for (const item of items) {
      this.userArray.push(item.id);
    }
  }
  onMultiDeSelectAddGroupAll(items: any) {
    this.userArray=[];
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
