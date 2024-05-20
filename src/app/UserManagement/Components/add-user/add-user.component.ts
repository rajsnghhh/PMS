import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: [
    './add-user.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/survey-common.scss',
    '../../../../assets/scss/survey-offcanvas.scss'
  ]
})
export class AddUserComponent implements OnInit {
  @Output()
  parentFun = new EventEmitter<string>();

  userData:any
  importData: any;
  filen = "Choose file";
  addUser:any = {
    role : '',
    country :'',
    state: '',
    city: '',
    gender:'',
    department:'',
    zone:'',
    employement_type:'',
    designation: '',
    email: '',
    employe_code:'',
    imagefile:'',
    aadhar_number:'',
    pan_number:'',
    first_name:'',
    last_name:'',
    phone_no:'',
    blood_group:'',
    notice_period:'',
    company_list: '',
    address_line_1: '',
    address_line_2: '',
    reporting_manager: '',
    joining_date: '',
    last_working_date: '',
    date_of_birth: ''
  }
  stateList:any;
  countryList:any;
  roleList:any;
  companyList:any;

  cityList:any;
  departmentList:any;
  zoneList:any
  employmentList:any
  designationList:any
  reportingList:any;

  constructor (
    private router: Router, 
    private formBuilder: FormBuilder,
    private apiservice:APIService,
    private commonFunction:CommonFunctionService,
    private datasharedservice:DataSharedService,
    private toastrService: ToastrService,
    private el: ElementRef
  ) {
    
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.addUser.organization = this.userData.organisation_details[0].id
    this.viewCompany();
    this.getRoleList();
    this.getCompanyList();
    this.getCountryList();
    this.getDepartmentList();
    this.getZoneList();
    this.getEmploymentList();
  }

  viewCompany() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    this.apiservice.getCompanyList(params).subscribe(data => {
      this.addUser.company_name = data.results[0].id
    })
  }

  getDesignationList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
        company_id: this.addUser.company_list
      }
    )
    this.apiservice.getDesignationDetails(query).subscribe(data=> {
      this.designationList = data.results
    }, err => {
      
    })

    this.apiservice.getreportingList(query).subscribe(data=> {
      this.reportingList = data.results
    }, err => {
      
    })
    this.addUser.designation='';
    this.addUser.reporting_manager='';
  }

  getRoleList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getRoleList(query).subscribe(data=> {
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
    this.apiservice.getEmployeeList(query).subscribe(data=> {
      this.employmentList = data.results
    }, err => {
      
    })
  }

  getCountryList(){
    this.apiservice.getCountryList().subscribe(data => {
      this.countryList = data;
    })
  }
  changeCountry() {
    this.cityList=[];
    let countryId = new URLSearchParams();
    countryId.set('country_id', this.addUser.country)
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
    this.apiservice.getDepartmentList(query).subscribe(data=> {
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
    this.apiservice.getZoneList(query).subscribe(data=> {
      this.zoneList = data.results
    }, err => {
      
    })

  }

  getCityList() {
    if(this.addUser.state != '') {
      
      this.apiservice.getCityList('state_id='+this.addUser.state).subscribe(data=> {
        this.cityList = data
        if(this.addUser.city != '') {
          this.addUser.city = ''
        }
      }, err => {
        
      })
    }
    
  }
  
  uploadFile(event: any) {
    this.importData = event.target.files[0];
    this.filen = event.target.files[0].name;
    this.toastrService.success("Image Added Successfully", '', {
      timeOut: 2000,
    });
    var reader = new FileReader();
    reader.readAsDataURL(this.importData); 
    reader.onload = (event) => { 
      this.addUser.imagefile = event.target!.result;
    }
  }
  imageDelete(){
    this.addUser.imagefile ='';
    this.importData='';
  }
  onuserSubmit() {
    var form_data = new FormData();

    for ( var key in this.addUser ) {
      if(this.addUser[key] != null) {
        form_data.append(key, this.addUser[key]);
      }
    }
    if(this.importData) {
      form_data.append('image', this.importData);
    }else{
      form_data.append('image', '');
    }
    
    this.apiservice.addUser(form_data).subscribe(data=> {
      this.toastrService.success('User Added Successfully', '', {
        timeOut: 2000,
      });
      this.parentFun.emit();
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

  
  resetADD(form: NgForm): void {
    this.parentFun.emit();
    // form.reset();
  }

  PANupCase($event:any) {
    this.addUser.pan_number = this.addUser.pan_number.toUpperCase()
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      "form .ng-invalid"
    );
    
    firstInvalidControl.focus();
  }
}
