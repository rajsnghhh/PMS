import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: [
    './search-user.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class SearchUserComponent implements OnInit {
  @Output()
  parentFun = new EventEmitter<string>();

  departmentList: any;
  designationList: any;
  ZoneList: any;
  RoleList: any;
  userData: any;
  statelist: any;
  companyList:any;
  statePayload:any;
  employmentList:any;
  selectDepartment:any;
  selectDesignation:any;
  selectZone:any;
  selectRole:any;
  selectState:any;
  selectCity:any;
  selectEmpType:any;

  cityList: any = [];
  paramStateId:any=[];

  dropdownMultiSelectDepartmentSettings = {};
  dropdownMultiSelectDesignationSettings = {};
  dropdownMultiSelectEmpTypeSettings = {};
  dropdownMultiSelectZoneSettings = {};
  dropdownMultiSelectRoleSettings = {};
  dropdownMultiSelectStateSettings = {};
  dropdownMultiSelectCitySettings = {};

  dropdownMultiselectDepartmentList: any = [];
  dropdownMultiselectDesignationList: any = [];
  dropdownMultiselectEmpTypeList: any = [];
  dropdownMultiselectZoneList: any = [];
  dropdownMultiselectRoleList: any = [];
  dropdownMultiselectStateList: any = [];
  dropdownMultiselectCityList: any = [];




  searchUser: any = {
    search: '',
    department: [],
    designation: [],
    zone: [],
    role: [],
    state: [],
    city: [],
    emptype:[],
    companyId:''
  }
  constructor(
    private commonFunction: CommonFunctionService,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getDepartmentList();
    this.getRoleList();
    this.getEmploymentList();
    this.getZoneList();
    this.getCompanyList();
    this.getStateList();
    this.setupMultiSelectOptions();
  }

  getCompanyList(){
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    this.apiservice.getCompanyList(params).subscribe(data => {
      this.companyList = data.results;
    })
  }
  selectCompany(){
    this.getDesignationList(this.searchUser.companyId);
  }
  getRoleList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getRoleList(query).subscribe(data => {
      this.RoleList = data.results;
      this.showMultiRoleSelect();
    }, err => {

    })
  }
  getZoneList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getZoneList(query).subscribe(data => {
      this.ZoneList = data.results;
      this.showMultiZoneSelect();
    })
  }
  getDepartmentList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getDepartmentList(query).subscribe(data => {
      this.departmentList = data.results;
      this.showMultiDepartmentSelect();
    }, err => {

    })
  }
  getEmploymentList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getEmployeeList(query).subscribe(data=> {
      this.employmentList = data.results;
      this.showMultiEmpTypeSelect();
    }, err => {
      
    })
  }
  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102')
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.statelist = data;
      this.showMultiStateSelect();
    })
  }
  getDesignationList(compId:any) {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
        company_id:compId

      }
    )
    this.apiservice.getDesignationDetails(query).subscribe(data => {
      this.designationList = data.results;
      this.showMultiDesignationSelect();
    }, err => {

    })
  }
  setupMultiSelectOptions() {
    this.dropdownMultiSelectDepartmentSettings = {
      singleSelection: false,
      text: "Select Department",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.dropdownMultiSelectDesignationSettings = {
      singleSelection: false,
      text: "Select Role",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.dropdownMultiSelectEmpTypeSettings = {
      singleSelection: false,
      text: "Select Employment",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.dropdownMultiSelectZoneSettings = {
      singleSelection: false,
      text: "Select Zone",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.dropdownMultiSelectRoleSettings = {
      singleSelection: false,
      text: "Select Profile",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.dropdownMultiSelectStateSettings = {
      singleSelection: false,
      text: "Select State",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.dropdownMultiSelectCitySettings = {
      singleSelection: false,
      text: "Select City",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }

  onMultiSelectDepartment(item: any) {
    this.searchUser.department.push(item.id);
  }
  onMultiSelectDesignation(item: any) {
    this.searchUser.designation.push(item.id);
  }
  onMultiSelectZone(item: any) {
    this.searchUser.zone.push(item.id);
  }
  onMultiSelectRole(item: any) {
    this.searchUser.role.push(item.id);
  }
  onMultiSelectState(item: any) {
    this.searchUser.state.push(item.id);
    this.paramStateStructure();
  }
  onMultiSelectCity(item: any) {
    this.searchUser.city.push(item.id);
  }
  onMultiSelectEmpType(item: any) {
    this.searchUser.emptype.push(item.id);
  }



  OnMultiDeSelectDepartment(item: any) {
    const index: number = this.searchUser.department.indexOf(item.id);
    if (index !== -1) {
      this.searchUser.department.splice(index, 1);
    }
  }
  OnMultiDeSelectDesignation(item: any) {
    const index: number = this.searchUser.designation.indexOf(item.id);
    if (index !== -1) {
      this.searchUser.designation.splice(index, 1);
    }
  }
  OnMultiDeSelectZone(item: any) {
    const index: number = this.searchUser.zone.indexOf(item.id);
    if (index !== -1) {
      this.searchUser.zone.splice(index, 1);
    }
  }
  OnMultiDeSelectRole(item: any) {
    const index: number = this.searchUser.role.indexOf(item.id);
    if (index !== -1) {
      this.searchUser.role.splice(index, 1);
    }
  }
  OnMultiDeSelectState(item: any) {
    const index: number = this.searchUser.state.indexOf(item.id);
    if (index !== -1) {
      this.searchUser.state.splice(index, 1);
    }
    this.paramStateStructure();
  }
  OnMultiDeSelectCity(item: any) {
    const index: number = this.searchUser.city.indexOf(item.id);
    if (index !== -1) {
      this.searchUser.city.splice(index, 1);
    }
  }
  OnMultiDeSelectEmpType(item: any) {
    const index: number = this.searchUser.emptype.indexOf(item.id);
    if (index !== -1) {
      this.searchUser.emptype.splice(index, 1);
    }
  }


  onMultiSelectAllDepartment(items: any) {
    this.searchUser.department = [];
    for (const item of items) {
      this.searchUser.department.push(item.id);
    }
  }
  onMultiSelectAllDesignation(items: any) {
    this.searchUser.designation = [];
    for (const item of items) {
      this.searchUser.designation.push(item.id);
    }
  }
  onMultiSelectAllZone(items: any) {
    this.searchUser.zone = [];
    for (const item of items) {
      this.searchUser.zone.push(item.id);
    }
  }
  onMultiSelectAllRole(items: any) {
    this.searchUser.role = [];
    for (const item of items) {
      this.searchUser.role.push(item.id);
    }
  }
  onMultiSelectAllState(items: any) {
    this.searchUser.state = [];
    for (const item of items) {
      this.searchUser.state.push(item.id);
    }
    this.paramStateStructure();
  }
  onMultiSelectAllCity(items: any) {
    this.searchUser.city = [];
    for (const item of items) {
      this.searchUser.city.push(item.id);
    }
  }
  onMultiSelectAllEmpType(items: any) {
    this.searchUser.emptype = [];
    for (const item of items) {
      this.searchUser.emptype.push(item.id);
    }
  }



  onMultiDeSelectAllDepartment(items: any) {
    this.searchUser.department = [];
  }
  onMultiDeSelectAllDesignation(items: any) {
    this.searchUser.designation = [];
  }
  onMultiDeSelectAllZone(items: any) {
    this.searchUser.zone = [];
  }
  onMultiDeSelectAllRole(items: any) {
    this.searchUser.role = [];
  }
  onMultiDeSelectAllState(items: any) {
    this.searchUser.state = [];
  }
  onMultiDeSelectAllCity(items: any) {
    this.searchUser.city = [];
  }
  onMultiDeSelectAllEmpType(items: any) {
    this.searchUser.emptype = [];
  }


  showMultiStateSelect() {
    this.dropdownMultiselectStateList = [];
    for (const item of this.statelist) {
      var obj = {
        id: item.state_id,
        itemName: item.name
      }
      this.dropdownMultiselectStateList.push(obj);
    }
  }
  showMultiCitySelect() {
    this.dropdownMultiselectCityList = [];
    for (const item of this.cityList) {
      var obj = {
        id: item.city_id,
        itemName: item.name
      }
      this.dropdownMultiselectCityList.push(obj);
    }
  }
  showMultiDepartmentSelect(){
    this.dropdownMultiselectDepartmentList = [];
    for (const item of this.departmentList) {
      var obj = {
        id: item.id,
        itemName: item.department
      }
      this.dropdownMultiselectDepartmentList.push(obj);
    }
  }
  showMultiEmpTypeSelect(){
    this.dropdownMultiselectEmpTypeList = [];
    for (const item of this.employmentList) {
      var obj = {
        id: item.id,
        itemName: item.user_type
      }
      this.dropdownMultiselectEmpTypeList.push(obj);
    }
  }
  showMultiDesignationSelect(){
    this.dropdownMultiselectDesignationList = [];
    for (const item of this.designationList) {
      var obj = {
        id: item.id,
        itemName: item.designation
      }
      this.dropdownMultiselectDesignationList.push(obj);
    }
  }
  showMultiZoneSelect(){
    this.dropdownMultiselectZoneList = [];
    for (const item of this.ZoneList) {
      var obj = {
        id: item.id,
        itemName: item.zone_name
      }
      this.dropdownMultiselectZoneList.push(obj);
    }
  }
  showMultiRoleSelect(){
    this.dropdownMultiselectRoleList = [];
    for (const item of this.RoleList) {
      var obj = {
        id: item.id,
        itemName: item.role_name
      }
      this.dropdownMultiselectRoleList.push(obj);
    }
  }

  paramStateStructure(){
    this.paramStateId=[];
    for (const item of this.selectState) {
      var obj = {
        state_id: item.id
      }
      this.paramStateId.push(obj);
    }
    let strValue = JSON.stringify(this.paramStateId); 
    let result = strValue.replace(/:/g,"=").replace(/,/g,"&").replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");
    let result1=result.split('[');
    let result2=result1[1].split(']');

    this.statePayload = new URLSearchParams();
    this.statePayload='';
    this.statePayload=result2[0];

    this.apiservice.getCityList(this.statePayload).subscribe(data => {
      this.cityList=data;
      this.showMultiCitySelect();
    })
  }


  searchUserData() {
    if (this.searchUser.search == '' && this.searchUser.companyId=='' &&  this.searchUser.department.length == 0 && this.searchUser.designation.length == 0 && this.searchUser.zone.length == 0 && this.searchUser.role.length == 0 && this.searchUser.state.length == 0 && this.searchUser.city.length == 0 && this.searchUser.emptype.length == 0) {
      this.toastrService.error('Please enter user data to search', '', {
        timeOut: 2000,
      });
    } else {
      this.datasharedservice.saveLocalData('Searchtemp', JSON.stringify(this.searchUser))
      this.parentFun.emit();
    }

  }
  resetSearch() {
    this.searchUser.search = '';
    this.searchUser.department = [];
    this.searchUser.designation = [];
    this.searchUser.zone = [];
    this.searchUser.role = [];
    this.searchUser.emptype = [];
    this.searchUser.state = [];
    this.searchUser.city = [];
    this.searchUser.companyId='';
    this.selectDepartment=[];
    this.selectDesignation=[];
    this.selectZone=[];
    this.selectRole=[];
    this.selectState=[];
    this.selectCity=[];
    this.selectEmpType=[];
    this.searchUser.reset = true;
    this.datasharedservice.saveLocalData('Searchtemp', JSON.stringify(this.searchUser))
    this.searchUser.reset = false;
    this.parentFun.emit();
  }

}
