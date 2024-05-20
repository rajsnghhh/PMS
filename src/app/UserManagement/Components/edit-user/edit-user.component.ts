import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: [
    './edit-user.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class EditUserComponent implements OnInit {
  @Output()
  parentFun = new EventEmitter<string>();

  userData: any
  importData: any;
  editUserId: any;
  filen = "Choose file";
  prevdataList: any;
  companyList:any;
  reportingList:any;
  editUser: any = {
    role: '',
    country: '',
    state: '',
    city: '',
    gender: '',
    department: '',
    zone: '',
    employement_type: '',
    designation: '',
    email: '',
    employe_code:'',
    aadhar_number:'',
    pan_number:'',
    first_name:'',
    last_name:'',
    phone_no:'',
    blood_group:'',
    notice_period:'',
    company_name:'',
    address_line_1: '',
    address_line_2: '',
    reporting_manager: '',
    joining_date: '',
    last_working_date: '',
    date_of_birth: ''

  }
  stateList: any;
  countryList: any;
  roleList: any;
  cityList: any;
  departmentList: any;
  zoneList: any
  employmentList: any
  designationList: any;
  image_action = 'skip';

  queryParaMap: any = {
    id: '',
    organisation: ''
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private commonFunction: CommonFunctionService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private el: ElementRef
  ) {

  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.queryParaMap.organisation = this.userData.organisation_details[0].id
    this.editUser.organization = this.userData.organisation_details[0].id
    this.getRoleList();
    this.getCountryList();
    this.getDepartmentList();
    this.getZoneList();
    this.getEmploymentList();
    this.getCompanyList();
    this.getDesignationList();
  }

  
 

  getData(id: string) {
    this.importData = null;
    this.image_action = 'skip';
    this.cityList = []
    this.stateList = []
    this.queryParaMap.id = id;
    this.editUserId = id;
    let query = this.commonFunction.getURL(this.queryParaMap)
    this.apiservice.getUserList(query).subscribe(data => {
      this.prevdataList = data.results[0];
      this.editUser.first_name = this.prevdataList.first_name;
      this.editUser.company_name = this.prevdataList.company_name;
      this.editUser.last_name = this.prevdataList.last_name;
      this.editUser.email = this.prevdataList.email;
      this.editUser.employe_code=this.prevdataList.employe_code;
      this.editUser.phone_no = this.prevdataList.phone_no;
      this.editUser.designation = this.prevdataList.designation;
      this.editUser.role = this.prevdataList.role;
      this.editUser.country = this.prevdataList.country;
      this.editUser.state = this.prevdataList.state;
      this.editUser.city = this.prevdataList.city;
      this.editUser.gender = this.prevdataList.gender;
      this.editUser.department = this.prevdataList.department;
      this.editUser.aadhar_number = this.prevdataList.aadhar_number;
      this.editUser.pan_number = this.prevdataList.pan_number;
      this.editUser.zone = this.prevdataList.zone;
      this.editUser.employement_type = this.prevdataList.employement_type;
      this.editUser.blood_group = this.prevdataList.blood_group;
      this.editUser.notice_period = this.prevdataList.notice_period;
      this.editUser.imagefile = this.prevdataList.profile_pic_url;
      this.editUser.is_active = this.prevdataList.is_active;
      this.editUser.reporting_manager = this.prevdataList.reporting_manager;
      this.editUser.address_line_1 = this.prevdataList.address_line_1;
      this.editUser.address_line_2 = this.prevdataList.address_line_2;
      this.editUser.joining_date = this.prevdataList.joining_date;
      this.editUser.last_working_date = this.prevdataList.last_working_date;
      this.editUser.date_of_birth = this.prevdataList.date_of_birth;

      this.getStateList();
      this.getCityList();
    })

  }

  getDesignationList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
        company_id: this.editUser.company_name,
        all: 'true'
      }
    )
    this.apiservice.getDesignationDetails(query).subscribe(data => {
      this.designationList = data.results
    }, err => {
      
    })
    
    this.apiservice.getreportingList(query).subscribe(data=> {
      this.reportingList = data.results
    }, err => {
      
    })
    this.editUser.designation='';
    this.editUser.reporting_manager='';
  }

  getRoleList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getRoleList(query).subscribe(data => {
      this.roleList = data.results
    }, err => {

    })
  }

  getCompanyList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getCompanyList(query).subscribe(data=> {
      this.companyList = data.results
    }, err => {
      
    })
  }

  getEmploymentList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getEmployeeList(query).subscribe(data => {
      this.employmentList = data.results
    }, err => {

    })
  }

  getCountryList() {
    this.apiservice.getCountryList().subscribe(data => {
      this.countryList = data;
    })
  }
  changeCountry() {
    this.cityList = [];
    let countryId = new URLSearchParams();
    countryId.set('country_id', this.editUser.country)
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.stateList = data;
    })
  }


  getDepartmentList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getDepartmentList(query).subscribe(data => {
      this.departmentList = data.results
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
      this.zoneList = data.results
    }, err => {

    })

  }

  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', this.editUser.country)
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.stateList = data;
    })
  }
  getCityList() {

    this.apiservice.getCityList('state_id=' + this.editUser.state).subscribe(data => {
      this.cityList = data
    })

  }
  getStateChangeList() {
    this.cityList = [];
    this.apiservice.getCityList('state_id=' + this.editUser.state).subscribe(data => {
      this.cityList = data
    })
  }

  uploadFile(event: any) {
    this.importData = event.target.files[0];
    this.filen = event.target.files[0].name;
    this.image_action = 'delete'
    this.toastrService.success("Image Added Successfully", '', {
      timeOut: 2000,
    });
    var reader = new FileReader();
    reader.readAsDataURL(this.importData); 
    reader.onload = (event) => { 
      this.editUser.imagefile = event.target!.result;
    }
  }
  imageDelete() {
    this.editUser.imagefile ='';
    this.importData='';
    this.image_action = 'delete'
  }

  onuserSubmit() {

    var form_data = new FormData();

    for (var key in this.editUser) {
      if(this.editUser[key] != null) {
        form_data.append(key, this.editUser[key]);
      }

    }
    form_data.append('image_action', this.image_action);
    if (this.importData) {
      form_data.append('image', this.importData);
    }else{
      form_data.append('image', '');
    }

    this.apiservice.updateUser(form_data, this.editUserId).subscribe(data => {
      this.toastrService.success('User Updated Successfully', '', {
        timeOut: 2000,
      });
      this.closeEdit()
      this.parentFun.emit();
    }, err => {
        this.toastrService.error(err.error.msg, '', {
          timeOut: 5000,
        });
    })
  }


  resetADD(): void {
    this.parentFun.emit();
    // form.reset();
  }

  closeEdit(): void {
    this.parentFun.emit();
    // form.reset();
  }

  PANupCase($event: any) {
    this.editUser.pan_number = this.editUser.pan_number.toUpperCase()
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      "form .ng-invalid"
    );
    
    firstInvalidControl.focus();
  }

}
