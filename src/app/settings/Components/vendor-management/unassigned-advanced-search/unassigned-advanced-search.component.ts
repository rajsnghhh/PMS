import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-unassigned-advanced-search',
  templateUrl: './unassigned-advanced-search.component.html',
  styleUrls: [
    './unassigned-advanced-search.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class UnassignedAdvancedSearchComponent implements OnInit{

  unassignedVendorAdvancedSearchForm!: FormGroup;
  localStorageData: any;
  unassignedVendorAdvancedSearchFormValue: any;
  siteList: Array<any> = [];
  vendorList: Array<any> = [];
  loginCompanyId: any = '';
  countrylist: any;
  statelist:any;
  cityList:any=[];

  constructor(
    private fb: FormBuilder,
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    this.loginCompanyId = this.localStorageData.company_details[0].id

    this.initUnassignedVendorAdvancedSearchForm();
    this.getSiteList();
    this.viewVendorList();
    this.getCountry();
    // this.getTaxHeadData();
    // this.getUserList()
    // this.getMaterialType();
  }

  initUnassignedVendorAdvancedSearchForm() {
    this.unassignedVendorAdvancedSearchForm = this.fb.group({
      site: [''],
      pan: [''],
      name: [''],
      accountGroup: [''],
      accountShow: [''],
      country: [''],
      state: [''],
      city: [''],

    });

  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.selectedMRDetails.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('unassigned', 'true');

    this.apiservice.getVendorList(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }

  getCountry(){
    this.apiservice.getCountryList().subscribe(data => {
      this.countrylist = data;
      
      this.getState(data[0].id);
    })
  }
  getState(countryId :any){
    let params = new URLSearchParams();
    params.set('country_id', countryId);
    this.apiservice.getStateList(params).subscribe(data => {
      this.statelist = data;
    })
  }

  getCity(stateId:any){
    let params = new URLSearchParams();
    params.set('state_id',stateId);
    this.apiservice.getCityList(params).subscribe(data => {
      this.cityList = data;
    })
  }

  changeCountry() {
    this.unassignedVendorAdvancedSearchForm.value.state = '';
    this.unassignedVendorAdvancedSearchForm.value.city = '';
  }
  changeState(){    
    this.getCity(this.unassignedVendorAdvancedSearchForm.value.state)
    this.unassignedVendorAdvancedSearchForm.value.city = '';
  }

  onSubmit() {

    let formdata = this.unassignedVendorAdvancedSearchForm.value

    let requestObj: any = {}

    if(formdata.accountShow == "loginCompany"){
      requestObj = {
        organization_id: this.localStorageData.organisation_details[0].id,

        name: formdata.name,
        account_group: formdata.accountGroup,
        pan: formdata.pan,
        company: this.loginCompanyId,
        state: formdata.state,
        city: formdata.city,
      }
    } else {
      requestObj = {
        organization_id: this.localStorageData.organisation_details[0].id,
  
        site: formdata.site,
        name: formdata.name,
        account_group: formdata.accountGroup,
        pan: formdata.pan,
        state: formdata.state,
        city: formdata.city,
      }
    }


    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.unassignedVendorAdvancedSearchFormValue = searchdata
  }

}
