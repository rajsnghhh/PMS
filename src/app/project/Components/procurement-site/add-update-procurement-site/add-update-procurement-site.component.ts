import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-procurement-site',
  templateUrl: './add-update-procurement-site.component.html',
  styleUrls: ['./add-update-procurement-site.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class AddUpdateProcurementSiteComponent {
  addUpdateProcurementSiteForm!: FormGroup;
  localStorageData: any;
  addUpdateButton: string = 'ADD';
  // projectList: Array<any> = [];
  isControlDisabled = true;
  isSelectDisabled: boolean = true;
  projectId: any;
  stateList:any = []
  dropdownMultiselectAddUserListSettings={};
  dropdownMultiselectAddUserList: any = [];
  selectedMultipleData:any=[];
  userArray:any=[];
  userList:any;
  totalUsersList: any = [];

  @Input() onEditProcurementSiteData: any;

  addProcurementSiteTemplate: any = {
    // project: '',
    site_name: '',
    slug: '',
    state: '',
    location: '',
    users: '',
    address : ''
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    // let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // this.apiservice.getProjectList(params).subscribe(data => {
    //   this.projectList = data.results;

    // })
    this.userListData()
    this.getStateList()
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    this.initAddUpdateProcurementSiteForm();
    if (this.onEditProcurementSiteData) {
      this.addUpdateButton = 'UPDATE'
    } else {
      this.addUpdateButton = 'ADD'
    }
    this.setupMultiSelectOptions();
  }

  initAddUpdateProcurementSiteForm() {
    this.addUpdateProcurementSiteForm = this.formBuilder.group({
      // project: [this.onEditProcurementSiteData ? this.onEditProcurementSiteData.project : '', Validators.required],
      site_name: [this.onEditProcurementSiteData ? this.onEditProcurementSiteData.site_name : '', Validators.required],
      slug: [this.onEditProcurementSiteData ? this.onEditProcurementSiteData.slug : '', Validators.required],
      location: [this.onEditProcurementSiteData ? this.onEditProcurementSiteData.location : '', Validators.required],
      state: [this.onEditProcurementSiteData ? this.onEditProcurementSiteData.state : '', Validators.required],
      users: [this.onEditProcurementSiteData ? this.onEditProcurementSiteData.users : '', Validators.required],
      address: [this.onEditProcurementSiteData ? this.onEditProcurementSiteData.address : Validators]

    })

    if (this.onEditProcurementSiteData) {      
      // this.addProcurementSiteTemplate.project = this.onEditProcurementSiteData.project
      this.addProcurementSiteTemplate.site_name = this.onEditProcurementSiteData.site_name
      this.addProcurementSiteTemplate.slug = this.onEditProcurementSiteData.slug
      this.addProcurementSiteTemplate.location = this.onEditProcurementSiteData.location
      this.addProcurementSiteTemplate.state = this.onEditProcurementSiteData.state;
      this.addProcurementSiteTemplate.users = this.onEditProcurementSiteData.users;
      this.addProcurementSiteTemplate.address = this.onEditProcurementSiteData.address;

      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      this.apiservice.getAllUserList(params).subscribe(data=> {      
        for(let i=0; i < data.length; i++) {
          data[i].last_name = ''
          data[i].first_name = data[i].full_name
        }
        this.userList = data;
        
        for (const item of this.addProcurementSiteTemplate.users) {
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
        this.addUpdateProcurementSiteForm.controls['users'].setErrors(null)
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      })


    }
    // else {
    //   let params = new URLSearchParams();
    //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
    //   this.apiservice.getProjectList(params).subscribe(data => {
    //     this.projectList = data.results;
    //     this.projectList?.forEach((x: any) => {
    //       this.addProcurementSiteTemplate.project = x.project_data[1].id
    //     })

    //   })

    // }
  }

  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102')
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.stateList = data;
    })
  }

  labelName() {
    this.addProcurementSiteTemplate.slug = this.internalName(this.addProcurementSiteTemplate.site_name).toLowerCase().replace(/[&\/\\#, +()$~%.₹@!^'":*?<>{}]/g, '_');
  }
  internalName(data: any) {
    let res = '';
    if (data) {
      res = data.replaceAll(' ', '_');
    }
    return res;
  }

  addUpdateProcurementSite() {

    if (this.addUpdateProcurementSiteForm.valid) {
      if (!this.onEditProcurementSiteData) {
        let add_body = {
          organization: this.localStorageData.organisation_details[0].id,
          // project: this.addUpdateProcurementSiteForm.value.project,
          project:parseInt(this.projectId),
          site_name: this.addUpdateProcurementSiteForm.value.site_name,
          slug: this.addUpdateProcurementSiteForm.value.slug,
          location: this.addUpdateProcurementSiteForm.value.location,
          state: this.addUpdateProcurementSiteForm.value.state,
          address:this.addUpdateProcurementSiteForm.value.address,
          users: this.userArray,
        }
        this.apiservice.addProcurementSite(add_body).subscribe((data: any) => {
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
          organization: this.onEditProcurementSiteData.organization,
          // project: this.addUpdateProcurementSiteForm.value.project,
          project:parseInt(this.projectId),
          site_name: this.addUpdateProcurementSiteForm.value.site_name,
          slug: this.addUpdateProcurementSiteForm.value.slug,
          location: this.addUpdateProcurementSiteForm.value.location,
          address:this.addUpdateProcurementSiteForm.value.address,
          state: this.addUpdateProcurementSiteForm.value.state,
          users: this.userArray,
        }
        this.apiservice.editProcurementSite(update_body, this.onEditProcurementSiteData.id, this.onEditProcurementSiteData.organization).subscribe((data: any) => {
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
      this.markFormGroupTouched(this.addUpdateProcurementSiteForm);
    }
  }

  userListData(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data=> {   
      
      for(let i=0; i < data?.length; i++) {
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

  setupMultiSelectOptions() {
    this.dropdownMultiselectAddUserListSettings = {
      singleSelection: false,
      text: "Select User",
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
