import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-update-labour',
  templateUrl: './add-update-labour.component.html',
  styleUrls: ['./add-update-labour.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddUpdateLabourComponent {

  addLabourMasterForm!: FormGroup;
  localStorageData: any;
  addUpdateButton: string = 'ADD';
  uomList: Array<any> = [];

  @Input() onEditLabourData: any;

  addLabourTemplate: any = {
    costType: '',
    Component: '',
    labourName: '',
    uom: '',
    basicWage: '',
    vda: '',
    pf: '',
    esi: ''
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) { }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
    this.addUpdateLabourForm();
    if (this.onEditLabourData) {
      this.addUpdateButton = 'UPDATE'
    } else {
      this.addUpdateButton = 'ADD'
    }
  }
 
  addUpdateLabourForm() {
    this.addLabourMasterForm = this.formBuilder.group({
      costType: [this.onEditLabourData ? this.onEditLabourData.cost_type : '', Validators.required],
      Component: [this.onEditLabourData ? this.onEditLabourData.component : '', Validators.required],
      labourName: [this.onEditLabourData ? this.onEditLabourData.name : '', Validators.required],
      uom: [this.onEditLabourData ? this.onEditLabourData.uom : '', Validators.required],
      basicWage: [this.onEditLabourData ? this.onEditLabourData.basic_wage : '', Validators.required],
      vda: [this.onEditLabourData ? this.onEditLabourData.vda : 0, Validators.required],
      pf: [this.onEditLabourData ? this.onEditLabourData.pf : 0, Validators.required],
      esi: [this.onEditLabourData ? this.onEditLabourData.esi : 0, Validators.required]
    })

    if (this.onEditLabourData) {
      this.addLabourTemplate.costType = this.onEditLabourData.cost_type
      this.addLabourTemplate.Component = this.onEditLabourData.component
      this.addLabourTemplate.labourName = this.onEditLabourData.name
      this.addLabourTemplate.uom = this.onEditLabourData.uom
      this.addLabourTemplate.basicWage = this.onEditLabourData.basic_wage
      this.addLabourTemplate.vda = this.onEditLabourData.vda
      this.addLabourTemplate.pf = this.onEditLabourData.pf
      this.addLabourTemplate.esi = this.onEditLabourData.esi
    }

  }

  addUpdateLabourMaster() {

    if (this.addLabourMasterForm.valid) {
      if (!this.onEditLabourData) {
        let add_body = {
          organization: this.localStorageData.organisation_details[0].id,
          cost_type: this.addLabourMasterForm.value.costType,
          component: this.addLabourMasterForm.value.Component,
          name: this.addLabourMasterForm.value.labourName,
          uom: this.addLabourMasterForm.value.uom,
          basic_wage: this.addLabourMasterForm.value.basicWage,
          vda: this.addLabourMasterForm.value.vda,
          pf: this.addLabourMasterForm.value.pf,
          esi: this.addLabourMasterForm.value.esi
        }
        this.apiservice.addLabourMaster(add_body).subscribe((data: any) => {
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
          organization: this.onEditLabourData.organization,
          cost_type: this.addLabourMasterForm.value.costType,
          component: this.addLabourMasterForm.value.Component,
          name: this.addLabourMasterForm.value.labourName,
          uom: this.addLabourMasterForm.value.uom,
          basic_wage: this.addLabourMasterForm.value.basicWage.toString(),
          vda: this.addLabourMasterForm.value.vda,
          pf: this.addLabourMasterForm.value.pf,
          esi: this.addLabourMasterForm.value.esi
        }
        this.apiservice.editLabourMaster(update_body, this.onEditLabourData.id, this.onEditLabourData.organization).subscribe((data: any) => {
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
      this.markFormGroupTouched(this.addLabourMasterForm);
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
