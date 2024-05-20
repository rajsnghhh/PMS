import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class AddDesignationComponent implements OnInit {
  dropdownCityList: any;
  dropdownStateList: any;
  roleListValue: any;

  selectedCity: any;
  selectedStates: any;
  adddesignationForm!: FormGroup;
  parrentid = ''
  dropdownCitySettings = {};
  dropdownStateSettings = {};
  localStorageData: any;
  selected_Comaony = ''
  addDesignation:any = {
    name : '',
    description : '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private commonFunction: CommonFunctionService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) {
    this.adddesignationForm = formBuilder.group({
      name: ['', Validators.required],
      roleid: ['', Validators.required],
      description: ['']
    })

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  setRoleValue(id: any,companyID:any) {
    this.parrentid = id;
    this.selected_Comaony = companyID;

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('company_id', companyID);
    this.apiservice.getDesignationDetails(params).subscribe(data => {
      this.roleListValue = data.results;
    })
  }

  setupMultiSelectOptions() {
    this.dropdownCityList = [
      { "id": 1, "itemName": "Ranchi" },
      { "id": 2, "itemName": "Durgapur" }
    ];
    this.dropdownStateList = [
      { "id": 1, "itemName": "Bihar" },
      { "id": 2, "itemName": "Jharkhand" }
    ];

    this.selectedCity = [];
    this.selectedStates = [];

    this.dropdownCitySettings = {
      singleSelection: false,
      text: "Select City",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.dropdownStateSettings = {
      singleSelection: false,
      text: "Select State",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    }

  }

  onCitySelect(item: any) {
  }
  OnCityDeSelect(item: any) {
  }
  onCitySelectAll(items: any) {
  }
  onCityDeSelectAll(items: any) {
  }



  onStateSelect(item: any) {

  }
  OnStateDeSelect(item: any) {

  }
  onStateSelectAll(items: any) {
  }
  onStateDeSelectAll(items: any) {
  }

  addnewDesignation() {
    if (this.adddesignationForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        designation: this.adddesignationForm.value.name,
        description: this.adddesignationForm.value.description,
        parent_id: this.adddesignationForm.value.roleid,
        company:this.selected_Comaony
      }
      this.apiservice.adddesignation(body).subscribe((data: any) => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, err => {
        if (err.error.detail) {
          this.toastrService.error(err.error.detail, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }

      })
    } else {
      this.markFormGroupTouched(this.adddesignationForm);
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
