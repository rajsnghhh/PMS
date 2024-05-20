import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-import-user',
  templateUrl: './import-user.component.html',
  styleUrls: [
    './import-user.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class ImportUserComponent implements OnInit {
  isLoading = false;
  activefrom = 'importuser';
  importData: any;
  filen = "";
  excelIcon: boolean = false;
  displayStyle = "none";
  userData: any;
  localStorageData: any;
  importForm!: FormGroup;


  firstName: any = '';
  lastName: any = '';
  phoneNo: any = '';
  email: any = '';
  username: any = '';
  gender: any = '';
  password: any = '';
  bloodGroup: any = '';
  noticePeriod: any = '';
  zone: any = '';
  employementType: any = '';
  designation: any = '';
  department: any = '';
  role: any = '';
  country: any = '';
  state: any = '';
  city: any = '';
  aadhar_number: any = '';
  pan_number: any = '';
  companyName: any = '';
  employeecode: any = '';
  reporting_manager: any = '';
  date_of_birth: any = '';
  address_line_1: any = '';
  address_line_2: any = '';
  last_working_date: any = '';
  joining_date: any = '';

  constructor(
    private importService: APIService,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService,
    private formBuilder: FormBuilder
  ) {
    this.importForm = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNo: ['', Validators.required],
      email: ['', Validators.required],
      // username: ['',],
      gender: [''],
      // password: ['',],
      bloodGroup: [''],
      noticePeriod: [''],
      employeecode: [''],
      employementType: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      aadhar_number: [''],
      pan_number: [''],
      companyName: ['', Validators.required],
      reporting_manager: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      address_line_1: [''],
      address_line_2: [''],
      last_working_date: [''],
      joining_date: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  uploadFile(event: any) {
    if (event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.importData = event.target.files[0];
      this.filen = event.target.files[0].name;
      this.toastrService.success("File Saved Successfully", '', {
        timeOut: 2000,
      });
      if (this.importData != null) {
        this.excelIcon = true;
      }
    } else {
      this.filen = "Choose file";
      this.toastrService.error("Please Choose a XLSX/CSV File", '', {
        timeOut: 2000,
      });
    }
  }

  importUser() {
    var formValue = new FormData();
    if (this.importData != null) {
      formValue.append('file', this.importData);
      this.importService.importUserData(formValue).subscribe((data: any) => {
        this.userData = data;
        this.activefrom = 'userlist'
        this.toastrService.success("File Uploaded Successfully", '', {
          timeOut: 2000,
        });
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      })
    } else {
      this.toastrService.error("Please Choose any file", '', {
        timeOut: 2000,
      });
    }
  }

  mapUser() {
    let strValue = JSON.stringify(this.userData);
    let result = strValue.replace(/"/g, "");
    let result1 = result.split('[');
    let result2 = result1[1].split(']');
    if (this.importForm.valid) {
      let body = {
        file_name: this.filen,
        fields: result2[0],
        first_name: this.importForm.value.firstName,
        last_name: this.importForm.value.lastName,
        email: this.importForm.value.email,
        // username: this.importForm.value.username,
        phone_no: this.importForm.value.phoneNo,
        // password: this.importForm.value.password,
        gender: this.importForm.value.gender,
        blood_group: this.importForm.value.bloodGroup,
        notice_period: this.importForm.value.noticePeriod,
        employee_code: this.importForm.value.employeecode,
        employement_type: this.importForm.value.employementType,
        company_name: this.importForm.value.companyName,
        designation: this.importForm.value.designation,
        department: this.importForm.value.department,
        aadhar_number: this.importForm.value.aadhar_number,
        pan_number: this.importForm.value.pan_number,
        reporting_manager: this.importForm.value.reporting_manager,
        date_of_birth: this.importForm.value.date_of_birth,
        address_line_1: this.importForm.value.address_line_1,
        address_line_2: this.importForm.value.address_line_2,
        last_working_date: this.importForm.value.last_working_date,
        joining_date: this.importForm.value.joining_date,

      }
      this.importService.mapUser(body, this.localStorageData.organisation_details[0].id).subscribe(data => {
        this.toastrService.success(data.message, '', {
          timeOut: 2000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, err => {
        if (err.status == 400) {
          this.toastrService.error(err.error.message, '', {
            timeOut: 4000,
          });
        } else {
          this.toastrService.error(Error_Messages.Failed_HTTP, '', {
            timeOut: 2000,
          });
        }
      })
    } else {
      this.toastrService.error("Please map all required fields", '', {
        timeOut: 2000,
      });
    }
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
      'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    };
  }
  // adddoc() {
  //   this.activefrom = 'submitupload'
  // }

  // submitfile() {
  //   this.activefrom = 'userlist'
  // }

}
