import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/Shared/Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-jv-priroty-master',
  templateUrl: './add-jv-priroty-master.component.html',
  styleUrls: ['./add-jv-priroty-master.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddJvPrirotyMasterComponent implements OnInit {

  @Output()
  parentFun = new EventEmitter<string>();

  dropdownCityList: any;
  dropdownStateList: any;
  localStorageData: any;

  selectedCity: any;
  selectedStates: any;
  addcompanyForm!: FormGroup;

  dropdownCitySettings = {};
  dropdownStateSettings = {};

  addCompany: any = {
    partyname: '',
    partyaddress: '',
    pannumber: '',
    gstnumber: '',
    emailid: '',
    phonenumber: '',
    contactname: '',
    contactno: '',
    contactemail: '',
    threshold: '',
    similarwork: '',
    spanofbridge: '',
    anuualturnover: '',
    networth: '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private el: ElementRef
  ) {
    this.addcompanyForm = formBuilder.group({
      party_name: ['', Validators.required],
      party_address: [''],
      pan: ['', Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
      gst: ['', Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)],
      email: ['', Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)],
      phone: [''],
      contact_person_name: [''],
      contact_person_phone_no: [''],
      contact_person_email_id: ['', Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)],
      available_threshold: [''],
      average_annual_turn_over: [''],
      maximum_span_length_of_bridge_avail: [''],
      net_worth: [''],
      value_of_similar_works: [''],
    })
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  addnewEmpMaster() {
    if (this.addcompanyForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        party_name: this.addcompanyForm.value.party_name,
        party_address: this.addcompanyForm.value.party_address,
        pan_no: this.addcompanyForm.value.pan,
        gst_no: this.addcompanyForm.value.gst,
        email_id: this.addcompanyForm.value.email,
        phone_no: this.addcompanyForm.value.phone,
        contact_person_name: this.addcompanyForm.value.contact_person_name,
        contact_person_phone_no: this.addcompanyForm.value.contact_person_phone_no,
        contact_person_email_id: this.addcompanyForm.value.contact_person_email_id,
        available_threshold: this.addcompanyForm.value.available_threshold,
        average_annual_turn_over: this.addcompanyForm.value.average_annual_turn_over,
        maximum_span_length_of_bridge_avail: this.addcompanyForm.value.maximum_span_length_of_bridge_avail,
        net_worth: this.addcompanyForm.value.net_worth,
        value_of_similar_works: this.addcompanyForm.value.value_of_similar_works,
      }
      this.apiservice.addJVMaster(body).subscribe((data: any) => {
        if (data.status == 400) {
          this.toastrService.error(data.msg, '', {
            timeOut: 2000,
          });
        } else {
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        }
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
      this.markFormGroupTouched(this.addcompanyForm);
    }
  }

  close() {
    this.parentFun.emit();
  }

  PANupCase($event: any) {
    this.addcompanyForm.value.pan = this.addcompanyForm.value.pan.toUpperCase()
  }
  
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      "form .ng-invalid"
    );
    
    firstInvalidControl.focus();
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
