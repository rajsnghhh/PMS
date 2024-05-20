import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-project-store',
  templateUrl: './add-update-project-store.component.html',
  styleUrls: ['./add-update-project-store.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class AddUpdateProjectStoreComponent {
  addUpdateProjectStoreForm!: FormGroup;
  localStorageData: any;
  addUpdateButton: string = 'ADD';
  // projectList: Array<any> = [];
  isControlDisabled = true;
  isSelectDisabled: boolean = true;
  projectSiteList: Array<any> = [];
  projectId: any;

  dropdownMultiselectAddUserListSettings={};
  dropdownMultiselectAddUserList: any = [];
  selectedMultipleData:any=[];
  
  userArray:any=[];
  userList:any;
  totalUsersList: any = [];
  
  dropdownMultiselectAddRackListSettings={};
  dropdownMultiselectAddRackList: any = [];
  selectedMultipleRackData:any=[];
  
  rackArray:any=[];
  rackList:any = {};
  totalRacksList: any = [];

  @Input() onEditProjectStoreData: any;

  addProjectStoreTemplate: any = {
    // project: '',
    site: '',
    store_name: '',
    users: '',
    racks: '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    // let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // this.apiservice.getProjectList(params).subscribe(data => {
    //   this.projectList = data.results;
    // })
    this.initAddUpdateProjectStoreForm();

    if (this.onEditProjectStoreData) {
      this.addUpdateButton = 'UPDATE'
    } else {
      this.addUpdateButton = 'ADD'
    }

    this.getProjectSiteList();

    this.userListData()
    this.rackListData()

    this.setupMultiSelectOptions();
  }

  getProjectSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.projectId);
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.projectSiteList = data.results;
    })
  }

  initAddUpdateProjectStoreForm() {
    
    this.addUpdateProjectStoreForm = this.formBuilder.group({
      // project: [this.onEditProjectStoreData ? this.onEditProjectStoreData.project : '', Validators.required],
      site: [this.onEditProjectStoreData ? this.onEditProjectStoreData.site : '', Validators.required],
      store_name: [this.onEditProjectStoreData ? this.onEditProjectStoreData.store_name : '', Validators.required],
      users: [this.onEditProjectStoreData ? this.onEditProjectStoreData.users : '', Validators.required],
      racks: [this.onEditProjectStoreData ? this.onEditProjectStoreData.rack : '', Validators.required]
    })

    if (this.onEditProjectStoreData) {      
      // this.addProjectStoreTemplate.project = this.onEditProjectStoreData.project
      this.addProjectStoreTemplate.site = this.onEditProjectStoreData.site
      this.addProjectStoreTemplate.store_name = this.onEditProjectStoreData.store_name
      this.addProjectStoreTemplate.users = this.onEditProjectStoreData.users
      this.addProjectStoreTemplate.racks = this.onEditProjectStoreData.rack

      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      this.apiservice.getAllUserList(params).subscribe(data=> {      
        for(let i=0; i < data.length; i++) {
          data[i].last_name = ''
          data[i].first_name = data[i].full_name
        }
        this.userList = data;
        
        for (const item of this.addProjectStoreTemplate.users) {
          this.userArray.push(item);
          for (const user of this.userList){
            if(item == user.id){
              var obj = {
                id: user.id,
                itemName: user.full_name
              }
              this.selectedMultipleData.push(obj);
            }
          }
        }
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      })

      this.apiservice.getRackMasterList(params).subscribe(data1=> { 
        this.rackList = data1.results;
        
        for (const item of this.addProjectStoreTemplate.racks) {
          this.rackArray.push(item);
          for (const rack of this.rackList){
            if(item == rack.id){
              var obj = {
                id: rack.id,
                itemName: rack.section_name
              }
              this.selectedMultipleRackData.push(obj);
            }
          }
        }
        
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      })
    }
  }

  // labelName() {
  //   this.addProjectStoreTemplate.slug = this.internalName(this.addProjectStoreTemplate.site_name).toLowerCase().replace(/[&\/\\#, +()$~%.₹@!^'":*?<>{}]/g, '_');
  // }
  // internalName(data: any) {
  //   let res = '';
  //   if (data) {
  //     res = data.replaceAll(' ', '_');
  //   }
  //   return res;
  // }

  addUpdateProjectStore() {

    if (this.addUpdateProjectStoreForm.valid) {
      if (!this.onEditProjectStoreData) {
        let add_body = {
          organization: this.localStorageData.organisation_details[0].id,
          // project: this.addUpdateProjectStoreForm.value.project,
          project: this.projectId,
          site: this.addUpdateProjectStoreForm.value.site,
          store_name: this.addUpdateProjectStoreForm.value.store_name,
          users: this.userArray,
          rack: this.rackArray,
        }
        this.apiservice.addProjectStore(add_body).subscribe((data: any) => {
          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.success(data.msg, '', {
              timeOut: 2000,
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          }
        }, err => {
          if (err.error.error) {
            this.toastrService.error(err.error.error, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.error(Error_Messages.Failed_HTTP, '', {
              timeOut: 2000,
            });
          }
        })
      } else {
        let update_body = {
          organization: this.onEditProjectStoreData.organization,
          // project: this.addUpdateProjectStoreForm.value.project,
          project: this.projectId,
          site: this.addUpdateProjectStoreForm.value.site,
          store_name: this.addUpdateProjectStoreForm.value.store_name,
          users: this.userArray,
          rack: this.rackArray,
        }
        this.apiservice.editProjectStore(update_body, this.onEditProjectStoreData.id, this.onEditProjectStoreData.organization).subscribe((data: any) => {
          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.success(data.msg, '', {
              timeOut: 2000,
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          }
        }, err => {
          if (err.error.error) {
            this.toastrService.error(err.error.error, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.error(Error_Messages.Failed_HTTP, '', {
              timeOut: 2000,
            });
          }
        })
      }

    } else {
      this.markFormGroupTouched(this.addUpdateProjectStoreForm);
    }
  }

  userListData(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data=> {      
      for(let i=0; i < data.length; i++) {
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

  rackListData(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.apiservice.getRackMasterList(params).subscribe(data=> {
      this.rackList = data;
      
      this.showMultiRackSelect();

    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  setupMultiSelectOptions() {
    this.dropdownMultiselectAddUserListSettings = {
      singleSelection: false,
      text: "Select User",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    
    this.dropdownMultiselectAddRackListSettings = {
      singleSelection: false,
      text: "Select Racks",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }

  showMultiStateSelect() {
    this.dropdownMultiselectAddUserList=[];
    for (const item of this.userList) {
      var obj = {
        id: item.id,
        itemName: item.first_name +' '+ item.last_name
      }
      this.dropdownMultiselectAddUserList.push(obj);
    }
  }

  showMultiRackSelect() {
    this.dropdownMultiselectAddRackList=[];
    
    for (const item of this.rackList.results) {
      var obj = {
        id: item.id,
        itemName: item.section_name
      }
      this.dropdownMultiselectAddRackList.push(obj);
    }
  }

  onMultiSelectAddUser(item: any) {
  this.userArray.push(item.id)
  }
  OnMultiDeSelectAddUser(item: any) {
    const index: number = this.userArray.indexOf(item.id);
    if (index !== -1) {
      this.userArray.splice(index, 1);
    } 
  }
  onMultiSelectAddUserAll(items: any) {
    this.userArray=[];
    for (const item of items) {
      this.userArray.push(item.id);
    }
  }
  onMultiDeSelectAddUserAll(items: any) {
    this.userArray=[];
  }

  onMultiSelectAddRack(item: any) {
    this.rackArray.push(item.id)
  }
  OnMultiDeSelectAddRack(item: any) {
    const index: number = this.rackArray.indexOf(item.id);
    if (index !== -1) {
      this.rackArray.splice(index, 1);
    } 
  }
  onMultiSelectAddRackAll(items: any) {
    this.rackArray=[];
    for (const item of items) {
      this.rackArray.push(item.id);
    }
  }
  onMultiDeSelectAddRackAll(items: any) {
    this.rackArray=[];
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
