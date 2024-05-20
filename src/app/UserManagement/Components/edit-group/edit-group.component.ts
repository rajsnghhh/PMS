import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { Error_Messages,Success_Messages} from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss',
  '../../../../assets/scss/from-coomon.scss'
]
})
export class EditGroupComponent implements OnInit {

  dropdownMultiSelectSettings:any={};
  dropdownMultiselectList:any=[];
  selectedMultipleData:any=[];
  userList:any;
  userData: any;
  groupForm!: FormGroup;
  localStorageData:any;
  groupList:any;
  prevGroupData:any=[];
  userArray:any=[];
  editGroupId:any;
  groupName:any;
  prevIsActive:any;

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
      member: ['']
    })
   }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.setupMultiSelectOptions();
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.queryParaMap.organisation = this.userData.organisation_details[0].id
    this.userListData();
  }

  
  getData(id: string) {
    this.userArray=[];
    this.selectedMultipleData=[];
    this.editGroupId=id;
    let params = new URLSearchParams();
    params.set('id',this.editGroupId);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getGroupList(params).subscribe(data => {
      this.prevIsActive=data.is_active;
      this.groupName=data.group_name;
      for (const item of data.user_groups) {
        this.userArray.push(item.user_id);
        var obj = {
          id: item.user_id,
          itemName: item.full_name
        }
        this.selectedMultipleData.push(obj);
      } 
   });   
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
    this.dropdownMultiselectList=[];
    for (const item of this.userList) {
      var obj = {
        id: item.id,
        itemName: item.first_name +' '+ item.last_name
      }
      this.dropdownMultiselectList.push(obj);
    }
  }

  editGroup(){
    if (this.groupForm.valid) {
      let req = {
          group_name: this.groupForm.value.group_name,
          is_active:this.prevIsActive,
          user_ids:this.userArray
        }
        this.apiservice.updateGroupList(req,this.editGroupId,this.localStorageData.organisation_details[0].id).subscribe(data => {
          if(data.status==202){
            this.toastrService.success(Success_Messages.SuccessUpdate, '', {
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
      }, err => {
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
    this.dropdownMultiSelectSettings = {
      singleSelection: false,
      text: "Select Member",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }

  onMultiSelect(item: any) {
    this.userArray.push(item.id);
  }
  OnMultiDeSelect(item: any) {
    const index: number = this.userArray.indexOf(item.id);
    if (index !== -1) {
      this.userArray.splice(index, 1);
    } 
   }
  onMultiSelectAll(items: any) {
    this.userArray=[];
    for (const item of items) {
      this.userArray.push(item.id);
    } 
   }
  onMultiDeSelectAll(items: any) {
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
