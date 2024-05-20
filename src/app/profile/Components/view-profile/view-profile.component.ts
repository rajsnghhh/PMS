import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from "src/environments/environment";


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss',
    '../../../../assets/scss/scrollableTable.scss',
    '../../../../assets/scss/from-coomon.scss']
})
export class ViewProfileComponent implements OnInit {
  userData: any;
  qualificationList: any;
  countrylist: any;
  statelist:any;
  cityList:any=[];
  editInput: any = '';
  ActiveClass: any = 'personal';
  AcademicOptionData: any = [];
  ProfessionalOptionData: any = [];
  LicenseOptionData: any = [];
  OtherOptionData: any = [];
  profileListData: any = {};
  importData: any;
  environment = environment

  addPersonalInformation: any = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    mothers_name: '',
    fathers_name: '',
    address_line_1: '',
    address_line_2: '',
    country: '',
    state: '',
    city: '',
    aadhar_number: '',
    pan_number: '',
    gender: '',
    maratial_status: '',
    blood_group: '',
    emergency_contact_name: '',
    emergency_contact_phone_no: '',
  }

  tempUserData:any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private el: ElementRef,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.apiservice.getQualificationList().subscribe(data => {
      this.qualificationList = data;
    })
   this.getData();
   this.getCountry();
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



  getData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);
    params.set('id', this.userData.user_id);
    params.set('profile', '1');
    this.apiservice.getProfileList(params).subscribe(data => {
      this.tempUserData = data.results[0];
      this.userData.cu_profile_img = this.tempUserData.image
      this.userData.first_name = this.tempUserData.first_name
      this.userData.last_name = this.tempUserData.last_name
      this.datasharedservice.saveLocalData('userDATA',JSON.stringify(this.userData));
      this.profileListData = data.results[0];
      this.addPersonalInformation.first_name = this.profileListData.first_name;
      this.addPersonalInformation.last_name = this.profileListData.last_name;
      this.addPersonalInformation.date_of_birth = this.profileListData.date_of_birth;
      this.addPersonalInformation.gender = this.profileListData.gender;
      this.addPersonalInformation.maratial_status = this.profileListData.maratial_status;
      this.addPersonalInformation.blood_group = this.profileListData.blood_group;
      this.addPersonalInformation.aadhar_number = this.profileListData.aadhar_number;
      this.addPersonalInformation.pan_number = this.profileListData.pan_number;
      this.addPersonalInformation.phone_number = this.profileListData.phone_no;
      this.addPersonalInformation.fathers_name = this.profileListData.fathers_name;
      this.addPersonalInformation.mothers_name = this.profileListData.mothers_name;
      this.addPersonalInformation.address_line_1 = this.profileListData.address_line_1;
      this.addPersonalInformation.address_line_2 = this.profileListData.address_line_2;
      this.addPersonalInformation.country = this.profileListData.country;
      this.addPersonalInformation.state = this.profileListData.state;
      this.addPersonalInformation.city = this.profileListData.city;
      this.addPersonalInformation.emergency_contact_name = this.profileListData.emergency_contact_name;
      this.addPersonalInformation.emergency_contact_phone_no = this.profileListData.emergency_contact_phone_no;
      if(this.profileListData.state==''){
        this.cityList=[];
      }else{
        this.getCity(this.profileListData.state);
      }
    })
  }

  PANupCase($event:any) {
    this.addPersonalInformation.pan_number = this.addPersonalInformation.pan_number.toUpperCase()
  }

  changeCountry() {
    this.addPersonalInformation.state = '';
    this.addPersonalInformation.city = '';
  }
  changeState(stateIdvalue:any){
    this.getCity(stateIdvalue)
    this.addPersonalInformation.city = '';
  }

  prevAcademicData() {
    if (this.profileListData.academic_qualifications.length == 0) {
      this.AcademicOptionData = [];
      this.AcademicOptionData.push({
        user: this.userData.user_id,
        qualifications: '',
        details: '',
        file: ''
      });
    } else {
      this.AcademicOptionData = [];
      for (var data of this.profileListData.academic_qualifications) {
        this.AcademicOptionData.push({
          user: this.userData.user_id,
          qualifications: data.qualifications_id,
          details: data.details,
          file: data.file
        });
      }
    }

  }
  prevProfessionalData() {
    if (this.profileListData.work_experience.length == 0) {
      this.ProfessionalOptionData = [];
      this.ProfessionalOptionData.push({
        user: this.userData.user_id,
        organization_name: '',
        file: '',
        id: ''
      });
    } else {
      this.ProfessionalOptionData = [];
      for (var data of this.profileListData.work_experience) {
        this.ProfessionalOptionData.push({
          user: this.userData.user_id,
          organization_name: data.organization_name,
          file: data.file,
          id: data.id
        });
      }
    }
  }
  prevLicenseData() {
    if (this.profileListData.license_details.length == 0) {
      this.LicenseOptionData = [];
      this.LicenseOptionData.push({
        user: this.userData.user_id,
        license_name: '',
        file: '',
        id: ''
      });
    } else {
      this.LicenseOptionData = [];
      for (var data of this.profileListData.license_details) {
        this.LicenseOptionData.push({
          user: this.userData.user_id,
          license_name: data.license_name,
          file: data.file,
          id: data.id
        });
      }
    }
  }
  prevOtherData() {
    if (this.profileListData.other_documents.length == 0) {
      this.OtherOptionData = [];
      this.OtherOptionData.push({
        user: this.userData.user_id,
        document_name: '',
        file: '',
        id: ''
      });
    } else {
      this.OtherOptionData = [];
      for (var data of this.profileListData.other_documents) {
        this.OtherOptionData.push({
          user: this.userData.user_id,
          document_name: data.document_name,
          file: data.file,
          id: data.id
        });
      }
    }
  }

  uploadFile(event: any) {
    this.importData = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.importData);
    reader.onload = (event) => {
      this.profileListData.profile_pic_url = event.target!.result;
    }
  }
  uploadAcademicFile(event: any, index: any) {
    this.AcademicOptionData[index].file = event.target.files[0];
  }
  uploadProfessionalFile(event: any, index: any) {
    this.ProfessionalOptionData[index].file = event.target.files[0];
  }
  uploadLicenseFile(event: any, index: any) {
    this.LicenseOptionData[index].file = event.target.files[0];
  }
  uploadOtherFile(event: any, index: any) {
    this.OtherOptionData[index].file = event.target.files[0];
  }

  personalSubmit() {
    let params = new URLSearchParams();
    params.set('organization_id', this.userData.organisation_details[0].id);

    var form_data = new FormData();

    for (var key in this.addPersonalInformation) {
      form_data.append(key, this.addPersonalInformation[key]);
    }
    if (this.importData) {
      form_data.append('image', this.importData);
    } else {
      form_data.append('image', '');
    }

    this.apiservice.editProfile(params, form_data).subscribe(data => {
      this.toastrService.success('Profile Updated Successfully', '', {
        timeOut: 2000,
      });
      window.location.reload();
    })
  }
  AcademicUpdate() {
    let params = new URLSearchParams();
    params.set('method', 'edit');
    for (var char of this.AcademicOptionData) {
      var form_data = new FormData();
      for (var key in char) {
        form_data.append(key, char[key]);
      }
      this.apiservice.addAcademicProfile(params, form_data).subscribe(data => {
        this.toastrService.success('Academic Profile Updated Successfully', '', {
          timeOut: 2000,
        });
      })
      var form_data = new FormData();
    }
    this.getData();
    this.editInput = '';
    this.ActiveClass = 'academic';
  }
  professionalUpdate() {
    let params = new URLSearchParams();
    params.set('method', 'edit');
    for (var char of this.ProfessionalOptionData) {
      var form_data = new FormData();
      for (var key in char) {
        form_data.append(key, char[key]);
      }
      this.apiservice.addProfessionalProfile(params, form_data).subscribe(data => {
        this.toastrService.success('Professional information Updated Successfully', '', {
          timeOut: 2000,
        });
      })
      var form_data = new FormData();
    }
    this.getData();
    this.editInput = '';
    this.ActiveClass = 'professional';
  }
  licenseUpdate() {
    let params = new URLSearchParams();
    params.set('method', 'edit');
    for (var char of this.LicenseOptionData) {
      var form_data = new FormData();
      for (var key in char) {
        form_data.append(key, char[key]);
      }
      this.apiservice.addLicenseProfile(params, form_data).subscribe(data => {
        this.toastrService.success('LICENSES & CERTIFICATIONS Updated Successfully', '', {
          timeOut: 2000,
        });
      })
      var form_data = new FormData();
    }
    this.getData();
    this.editInput = '';
    this.ActiveClass = 'license';
  }
  otherUpdate() {
    let params = new URLSearchParams();
    params.set('method', 'edit');
    for (var char of this.OtherOptionData) {
      var form_data = new FormData();
      for (var key in char) {
        form_data.append(key, char[key]);
      }
      this.apiservice.addOtherProfile(params, form_data).subscribe(data => {
        this.toastrService.success('OTHER INFORMATION Updated Successfully', '', {
          timeOut: 2000,
        });
      })
      var form_data = new FormData();
    }
    this.getData();
    this.editInput = '';
    this.ActiveClass = 'other';
  }

  onTab(data: any) {
    this.ActiveClass = data;
    this.editInput = '';
  }
  editProfile(editdata: any) {
    this.editInput = editdata;
    if (this.editInput == 'editacademic') {
      this.prevAcademicData();
    } else if (this.editInput == 'editprofessional') {
      this.prevProfessionalData()
    } else if (this.editInput == 'editlicense') {
      this.prevLicenseData()
    } else if (this.editInput == 'editother') {
      this.prevOtherData()
    }
  }

  addAcademicOption() {
    this.AcademicOptionData.push({
      user: this.userData.user_id,
      qualifications: '',
      details: '',
      file: ''
    });
  }
  addProfessionalOption() {
    this.ProfessionalOptionData.push({
      user: this.userData.user_id,
      organization_name: '',
      file: '',
      id: ''
    })
  }
  addOtherOption() {
    this.OtherOptionData.push({
      user: this.userData.user_id,
      document_name: '',
      file: '',
      id: ''
    })
  }
  addLicenseOption() {
    this.LicenseOptionData.push({
      user: this.userData.user_id,
      license_name: '',
      file: '',
      id: ''
    })
  }

  removeAcademicOption(rid: number) {
    this.AcademicOptionData.splice(rid, 1);
  }
  removeProfessionalOption(rid: number) {
    this.ProfessionalOptionData.splice(rid, 1);
  }
  removeOtherOption(rid: number) {
    this.OtherOptionData.splice(rid, 1);
  }
  removeLicenseOption(rid: number) {
    this.LicenseOptionData.splice(rid, 1);
  }

  deleteAcademic(delId: any) {
    let params = new URLSearchParams();
    params.set('method', 'delete');
    params.set('id', delId);
    var form_data = new FormData();
    this.apiservice.addAcademicProfile(params, form_data).subscribe(data => {
      this.toastrService.success('Deleted Successfully', '', {
        timeOut: 2000,
      });
    })
    this.getData();
  }
  deleteProfessional(delId: any) {
    let params = new URLSearchParams();
    params.set('method', 'delete');
    params.set('id', delId);
    var form_data = new FormData();
    this.apiservice.addProfessionalProfile(params, form_data).subscribe(data => {
      this.toastrService.success('Deleted Successfully', '', {
        timeOut: 2000,
      });
    })
    this.getData();
  }
  deleteLicense(delId: any) {
    let params = new URLSearchParams();
    params.set('method', 'delete');
    params.set('id', delId);
    var form_data = new FormData();
    this.apiservice.addLicenseProfile(params, form_data).subscribe(data => {
      this.toastrService.success('Deleted Successfully', '', {
        timeOut: 2000,
      });
    })
    this.getData();
  }
  deleteOther(delId: any) {
    let params = new URLSearchParams();
    params.set('method', 'delete');
    params.set('id', delId);
    var form_data = new FormData();
    this.apiservice.addOtherProfile(params, form_data).subscribe(data => {
      this.toastrService.success('Deleted Successfully', '', {
        timeOut: 2000,
      });
    })
    this.getData();
  }

  downloadFile(File: any) {
    this.commonFunction.download(this.environment.API_URL + 'media/' + File, File.split("/")[File.split("/").length - 1])
  }
}
