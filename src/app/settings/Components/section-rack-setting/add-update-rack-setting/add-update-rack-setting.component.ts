import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-rack-setting',
  templateUrl: './add-update-rack-setting.component.html',
  styleUrls: [
    './add-update-rack-setting.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddUpdateRackSettingComponent implements OnInit{

  storeList: Array<any> = [];
  rackList: Array<any> = [];
  materialList: Array<any> = [];
  
  itemArray:any=[];

  addUpdateRackSettingForm!: FormGroup;
  localStorageData: any;
  addUpdateButton: string = 'ADD';

  dropdownMultiselectAddItemListSettings={};
  dropdownMultiselectAddItemList: any = [];
  selectedMultipleItemData:any=[];

  @Input() onEditRackData: any;
  @Input() onEditAccess: any;

  @Output("getRackSettingList") getRackSettingList: EventEmitter<any> = new EventEmitter();
  @Output("closeModal") closeModal: EventEmitter<any> = new EventEmitter();

  // @ViewChild('closeButton') closeButton!: ElementRef;

  addRackTemplate: any = {
    StoreLocation: '',
    RackName: '',
    Items: '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    this.setupMultiSelectOptions();

    this.getStoreList();
    this.getRackList();
    this.viewMaterialList();
    
    this.calladdUpdateRackSettingForm()

    if (this.onEditRackData) {
      this.addUpdateButton = 'UPDATE'
    } else {
      this.addUpdateButton = 'ADD'
    }
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('site__project', this.selectedMRDetails.project);
    // params.set('site', this.selectedMRDetails.site);
    params.set('all', 'true');

    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  getRackList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.apiservice.getRackMasterList(params).subscribe(data1=> { 
      this.rackList = data1.results;
      
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  // multiselect dropdown ==========
  viewMaterialList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.materialList = data.results;
      
      this.showMultiItemSelect();
    })
  }

  setupMultiSelectOptions() {
    this.dropdownMultiselectAddItemListSettings = {
      singleSelection: false,
      text: "Select Racks",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }
  showMultiItemSelect() {
    this.dropdownMultiselectAddItemList=[];
    
    for (const item of this.materialList) {
      var obj = {
        id: item.id,
        itemName: item.material_name + " (" + item.material_code + ")"
      }
      this.dropdownMultiselectAddItemList.push(obj);
    }
  }
  onMultiSelectAddItem(item: any) {
    this.itemArray.push(item.id)
  }
  OnMultiDeSelectAddItem(item: any) {
    const index: number = this.itemArray.indexOf(item.id);
    if (index !== -1) {
      this.itemArray.splice(index, 1);
    } 
  }
  onMultiSelectAddItemAll(items: any) {
    this.itemArray=[];
    for (const item of items) {
      this.itemArray.push(item.id);
    }
  }
  onMultiDeSelectAddItemAll(items: any) {
    this.itemArray=[];
  }
  // multiselect dropdown ==========

  calladdUpdateRackSettingForm() {
        
    this.addUpdateRackSettingForm = this.formBuilder.group({
      StoreLocation: [this.onEditRackData ? this.onEditRackData.location : '', Validators.required],
      RackName: [this.onEditRackData ? this.onEditRackData.rack : '', Validators.required],
      Items: [this.onEditRackData ? this.onEditRackData.item : '', Validators.required],
      
    })

    if (this.onEditRackData) {
      this.addRackTemplate.StoreLocation = this.onEditRackData.location   
      this.addRackTemplate.RackName = this.onEditRackData.rack
      this.addRackTemplate.Items = this.onEditRackData.item
      
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      this.apiservice.getMaterialManagementList(params).subscribe(data1=> { 
        this.materialList = data1.results;
        
        for (const material of this.addRackTemplate.Items) {
          this.itemArray.push(material);
          for (const item of this.materialList){
            if(material == item.id){
              var obj = {
                id: item.id,
                itemName: item.material_name + " (" + item.material_code + ")"
              }
              this.selectedMultipleItemData.push(obj);
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

  addUpdateRackMaster() {
    if (this.addUpdateRackSettingForm.valid) {
      if (!this.onEditRackData) {
        let RACK_SETTING_ADD_OBJ = {
          organization: this.localStorageData.organisation_details[0].id,
          location: this.addUpdateRackSettingForm.value.StoreLocation,
          rack: this.addUpdateRackSettingForm.value.RackName,
          item: this.itemArray,
        }

        this.apiservice.addRacSettings(RACK_SETTING_ADD_OBJ).subscribe((data: any) => {
          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.success(data.msg, '', {
              timeOut: 2000,
            });

            this.closeModal.emit();
            this.getRackSettingList.emit();
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
        let RACK_SETTING_UPDATE_OBJ = {
          organization: this.localStorageData.organisation_details[0].id,
          location: this.addUpdateRackSettingForm.value.StoreLocation,
          rack: this.addUpdateRackSettingForm.value.RackName,
          item: this.itemArray,
        }

        this.apiservice.editRackSetting(RACK_SETTING_UPDATE_OBJ, this.onEditRackData.organization, this.onEditRackData.id).subscribe((data: any) => {
          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            this.toastrService.success(data.msg, '', {
              timeOut: 2000,
            });

            this.closeModal.emit();
            this.getRackSettingList.emit();
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
      this.toastrService.error('Enter the fields', '', {
        timeOut: 2000,
      });

    }
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
