import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class EditLocationComponent implements OnInit {

  countrylist: any;
  statelist: any;
  cityList: any = [];
  stateIdArray: any = [];
  cityIdArray: any = [];
  localStorageData: any;
  dropdownCityList: any = [];
  dropdownStateList: any = [];
  paramStateId: any = [];
  statePayload: any;
  editId: any;
  prevCountry: any;
  selectedCity: any = [];
  selectedStates: any = [];
  previouszonename: any;


  dropdownCitySettings = {};
  dropdownStateSettings = {};
  zoneForm!: FormGroup;

  constructor(
    private apiservice: APIService,
    private formBuilder: FormBuilder,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService

  ) {
    this.zoneForm = formBuilder.group({
      zone_name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: [''],
      city: [''],
    })

  }

  ngOnInit(): void {
    this.apiservice.getCountryList().subscribe(data => {
      this.countrylist = data;
    })
    this.setupMultiSelectOptions();
  }

  getData(id: string) {
    this.stateIdArray = [];
    this.cityIdArray = [];
    this.selectedStates = [];
    this.selectedCity = [];
    this.editId = id;
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', id);
    this.apiservice.getZoneList(params).subscribe(data => {
      this.previouszonename = data.zone_name;
      this.prevCountry = data.country.id;

      for (const val of data.state_name_zone) {
        this.stateIdArray.push(val.state_id);
        var obj = {
          id: val.state_id,
          itemName: val.name
        }
        this.selectedStates.push(obj);
      }
      for (const doc of data.city_name_zone) {
        this.cityIdArray.push(doc.city_id);
        var obj2 = {
          id: doc.city_id,
          itemName: doc.name
        }
        this.selectedCity.push(obj2);
      }
      let countryId = new URLSearchParams();
      countryId.set('country_id', data.country.id)
      this.apiservice.getStateList(countryId).subscribe(data => {
        this.statelist = data;
        this.showMultiStateSelect();
      })


    })
  }


  changeCountry() {
    this.selectedStates = [];
    this.selectedCity = [];
    this.stateIdArray = [];
    this.cityIdArray = [];
  }

  showMultiStateSelect() {
    this.dropdownStateList = [];
    for (const item of this.statelist) {
      var obj = {
        id: item.state_id,
        itemName: item.name
      }
      this.dropdownStateList.push(obj);
    }

  }
  showMultiCitySelect() {
    this.dropdownCityList = [];
    for (const item of this.cityList) {
      var obj = {
        id: item.city_id,
        itemName: item.name
      }
      this.dropdownCityList.push(obj);
    }

  }
  updateZone() {
    this.cityIdArray = [];
    if (this.zoneForm.valid) {
      for (const item of this.selectedCity) {
        this.cityIdArray.push(item.id);
      }
      let req = {
        zone_name: this.zoneForm.value.zone_name,
        country_id: this.zoneForm.value.country,
        state_ids: this.stateIdArray,
        city_ids: this.cityIdArray
      }
      this.apiservice.editZone(req, this.editId, this.localStorageData.organisation_details[0].id).subscribe(data => {

        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, err => {
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
      this.markFormGroupTouched(this.zoneForm);
    }
  }

  setupMultiSelectOptions() {
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

  paramStateStructure() {
    this.paramStateId = [];
    for (const item of this.stateIdArray) {
      var obj = {
        state_id: item
      }
      this.paramStateId.push(obj);
    }
    let strValue = JSON.stringify(this.paramStateId);
    let result = strValue.replace(/:/g, "=").replace(/,/g, "&").replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
    let result1 = result.split('[');
    let result2 = result1[1].split(']');

    this.statePayload = new URLSearchParams();
    this.statePayload = result2[0];

    this.apiservice.getCityList(this.statePayload).subscribe(data => {
      this.cityList = data;
      this.showMultiCitySelect();
    })
  }
  onStateSelect(item: any) {
    this.selectedCity = [];
    this.cityIdArray = [];
    this.stateIdArray.push(item.id);
    this.paramStateStructure();
  }
  OnStateDeSelect(item: any) {
    this.selectedCity = [];
    this.cityIdArray = [];
    const index: number = this.stateIdArray.indexOf(item.id);
    if (index !== -1) {
      this.stateIdArray.splice(index, 1);
    }
    this.paramStateStructure();
  }
  onStateSelectAll(items: any) {
    this.selectedCity = [];
    this.cityIdArray = [];
    this.stateIdArray = [];
    for (const item of items) {
      this.stateIdArray.push(item.id);
    }
    this.paramStateStructure();

  }
  onStateDeSelectAll(items: any) {
    this.selectedCity = [];
    this.cityIdArray = [];
    this.stateIdArray = [];
    this.cityList = [];
    this.showMultiCitySelect();
  }


  onCitySelect(item: any) {
  }
  OnCityDeSelect(item: any) {
  }
  onCitySelectAll(items: any) {
  }
  onCityDeSelectAll(items: any) {
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
