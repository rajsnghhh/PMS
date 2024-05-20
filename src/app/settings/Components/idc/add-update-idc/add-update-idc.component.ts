import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-idc',
  templateUrl: './add-update-idc.component.html',
  styleUrls: ['./add-update-idc.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class AddUpdateIdcComponent {
  addUpdateIDCForm!: FormGroup;
  localStorageData: any;
  addUpdateButton: string = 'ADD';
  uomList: Array<any> = [];

  @Input() onEditIDCData: any;
  @Input() onEditAccess: any;


  addIDCTemplate: any = {
    IDCCategory: '',
    // IDCMasterName: '',
    // uom: '',
    // rate: ''
  }

  IDCDetails: Array<any> = [];



  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private cdref: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
    this.callAddUpdateIDCForm();

    if (this.onEditIDCData) {
      this.addUpdateButton = 'UPDATE'
    } else {
      this.addUpdateButton = 'ADD'
      this.IDCDetails.push({
        name: '',
        uom: '',
        rate: ''
      });
    }


  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  isAnyFieldFilled() { return this.IDCDetails.some(item => item.name && item.uom && item.rate); }

  callAddUpdateIDCForm() {
    this.addUpdateIDCForm = this.formBuilder.group({
      IDCCategory: [this.onEditIDCData ? this.onEditIDCData.category_name : '', Validators.required],
      // IDCMasterName: [this.onEditIDCData ? this.onEditIDCData.name : '', Validators.required],
      // uom: [this.onEditIDCData ? this.onEditIDCData.uom : '', Validators.required],
      // rate: [this.onEditIDCData ? this.onEditIDCData.rate : '', Validators.required]
      // IDCMasterName: ['', Validators.required],
      // uom: ['', Validators.required],
      // rate: ['', Validators.required]

    })

    if (this.onEditIDCData) {
      this.addIDCTemplate.IDCCategory = this.onEditIDCData.category_name
      this.IDCDetails = this.onEditIDCData.items
      // this.addIDCTemplate.IDCMasterName = this.onEditIDCData.name
      // this.addIDCTemplate.uom = this.onEditIDCData.uom
      // this.addIDCTemplate.rate = this.onEditIDCData.rate
    }

  }

  addIDCDetails() {
    this.IDCDetails.push({
      name: '',
      uom: '',
      rate: ''
    });
  }

  removeIDCDetails(id: number) {
    this.IDCDetails.splice(id, 1);

  }

  areAllFieldsFilled() { return this.IDCDetails.every(item => item.name && item.uom && item.rate); }

  addUpdateIDCMaster() {


    if (this.addUpdateIDCForm.valid && this.areAllFieldsFilled()) {
      if (!this.onEditIDCData) {
        let IDC_ADD_OBJ = {
          organization: this.localStorageData.organisation_details[0].id,
          name: this.addUpdateIDCForm.value.IDCCategory
        }

        this.apiservice.addIndirectCostCategory(IDC_ADD_OBJ).subscribe((data: any) => {

          let indirect_cost_category = data?.results?.Data?.id

          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            if (indirect_cost_category) {
              const newKeyValue1 = this.localStorageData.organisation_details[0].id;
              const newKeyValue2 = indirect_cost_category;
              const updatedArray = this.IDCDetails.map(obj => ({ ...obj, organization: newKeyValue1, indirect_cost_category: newKeyValue2 }));

              let IDC_MASTER_ADD_OBJ = updatedArray
              // {
              //   organization: this.localStorageData.organisation_details[0].id,
              //   indirect_cost_category: indirect_cost_category,
              //   name: this.addUpdateIDCForm.value.IDCMasterName,
              //   uom: this.addUpdateIDCForm.value.uom,
              //   rate: this.addUpdateIDCForm.value.rate,
              // }
              this.apiservice.addIndirectCostMaster(IDC_MASTER_ADD_OBJ).subscribe((final_data: any) => {
                if (data.status == 400) {
                  this.toastrService.error(data.msg, '', {
                    timeOut: 2000,
                  });
                } else {
                  this.toastrService.success(data.msg, '', {
                    timeOut: 2000,
                  });
                  // setTimeout(function () {
                  //   window.location.reload();
                  // }, 2000);
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

        let IDC_UPDATE_OBJ = {
          organization: this.localStorageData.organisation_details[0].id,
          name: this.addUpdateIDCForm.value.IDCCategory
        }

        this.apiservice.editIndirectCostCategory(IDC_UPDATE_OBJ, this.onEditIDCData.organization, this.onEditIDCData.id).subscribe((data: any) => {

          let indirect_cost_category = data?.results?.Data?.id

          if (data.status == 400) {
            this.toastrService.error(data.msg, '', {
              timeOut: 2000,
            });
          } else {
            if (indirect_cost_category) {
              const newKeyValue1update = this.localStorageData.organisation_details[0].id;
              const newKeyValue2update = indirect_cost_category;
              const updatedArray = this.IDCDetails.map(obj => ({ ...obj, organization: newKeyValue1update, indirect_cost_category: newKeyValue2update }));

              let IDC_MASTER_UPDATE_OBJ = updatedArray
              // {
              //   organization: this.localStorageData.organisation_details[0].id,
              //   indirect_cost_category: indirect_cost_category,
              //   name: this.addUpdateIDCForm.value.IDCMasterName,
              //   uom: parseInt(this.addUpdateIDCForm.value.uom),
              //   rate: parseInt(this.addUpdateIDCForm.value.rate),
              // }

              // Create a new array where id is not available
              let newArrayWithId = IDC_MASTER_UPDATE_OBJ.filter(item => !item.id);

              // Remove objects from the existing array if id is not available
              IDC_MASTER_UPDATE_OBJ = IDC_MASTER_UPDATE_OBJ.filter(item => item.id !== undefined);

              newArrayWithId = newArrayWithId.map(obj => ({ ...obj, organization: newKeyValue1update, indirect_cost_category: newKeyValue2update }));

              this.apiservice.editIndirectCostMaster(IDC_MASTER_UPDATE_OBJ, this.onEditIDCData.organization, this.onEditIDCData.id).subscribe((final_data: any) => {
                if (data.status == 400) {
                  this.toastrService.error(data.msg, '', {
                    timeOut: 2000,
                  });
                } else {

                  if (newArrayWithId.length > 0) {
                    this.apiservice.addIndirectCostMaster(newArrayWithId).subscribe((final_data: any) => {
                      if (data.status == 400) {
                        this.toastrService.error(data.msg, '', {
                          timeOut: 2000,
                        });
                      } else {
                        this.toastrService.success(data.msg, '', {
                          timeOut: 2000,
                        });
                      }

                    })

                  }
                  if (newArrayWithId.length == 0) {
                    this.toastrService.success(data.msg, '', {
                      timeOut: 2000,
                    });
                  }
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

  onlyInteger(event: any) {
    const charCode = event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
