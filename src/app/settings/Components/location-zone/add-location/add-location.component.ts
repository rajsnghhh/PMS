import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: [
    './add-location.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddLocationComponent implements OnInit {

  countrylist: any;
  statelist: any;
  cityList:any=[];
  stateIdArray: any = [];
  cityIdArray:any=[];
  localStorageData: any;
  dropdownCityList: any = [];
  dropdownStateList: any = [];
  paramStateId:any=[];
  statePayload:any;

  selectedCity: any=[];
  selectedStates: any=[];

  addLocation:any = {
    zonename : '',
    countryname : '',
  }


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
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
    })

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.apiservice.getCountryList().subscribe(data => {
      this.countrylist = data;
    })
    this.setupMultiSelectOptions();
  }
  changeCountry() {
    this.selectedStates=[];
    this.selectedCity=[];
    let countryId = new URLSearchParams();
    countryId.set('country_id', this.zoneForm.value.country)
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.statelist = data;
      this.showMultiStateSelect();
    })
  }
  
  showMultiStateSelect() {
    this.dropdownStateList=[];
    for (const item of this.statelist) {
      var obj = {
        id: item.state_id,
        itemName: item.name
      }
      this.dropdownStateList.push(obj);
    }

  }
  showMultiCitySelect() {
    this.dropdownCityList=[];
    for (const item of this.cityList) {
      var obj = {
        id: item.city_id,
        itemName: item.name
      }
      this.dropdownCityList.push(obj);
    }

  }
  addZone() {
    if (this.zoneForm.valid) {
      for (const item of this.selectedCity) {
        this.cityIdArray.push(item.id);
      }
      let req = {
        zone_name: this.zoneForm.value.zone_name,
        country_id: this.zoneForm.value.country,
        organization: this.localStorageData.organisation_details[0].id,
        state_ids: this.stateIdArray,
        city_ids: this.cityIdArray
      }
      this.apiservice.addZone(req).subscribe(data => {
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
      this.markFormGroupTouched(this.zoneForm);
    }

  }

  setupMultiSelectOptions() {
    this.selectedCity = [];
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

  paramStateStructure(){
    this.paramStateId=[];
    for (const item of this.stateIdArray) {
      var obj = {
        state_id: item
      }
      this.paramStateId.push(obj);
    }
    let strValue = JSON.stringify(this.paramStateId); 
    let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
    let result1=result.split('[');
    let result2=result1[1].split(']');

    this.statePayload = new URLSearchParams();
    this.statePayload=result2[0];

    this.apiservice.getCityList(this.statePayload).subscribe(data => {
      this.cityList=data;
      this.showMultiCitySelect();
    })
  }
  onStateSelect(item: any) {
    this.stateIdArray.push(item.id);
    this.paramStateStructure();
  }
  OnStateDeSelect(item: any) {
    const index: number = this.stateIdArray.indexOf(item.id);
        if (index !== -1) {
          this.stateIdArray.splice(index, 1);
        } 
    this.paramStateStructure();
  }
  onStateSelectAll(items: any) {
    this.stateIdArray=[];
    for (const item of items) {
      this.stateIdArray.push(item.id);
    }
    this.paramStateStructure();

  }
  onStateDeSelectAll(items: any) {
    this.stateIdArray=[];
    this.cityList=[];
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
