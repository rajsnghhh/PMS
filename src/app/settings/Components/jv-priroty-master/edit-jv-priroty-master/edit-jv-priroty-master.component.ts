import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-edit-jv-priroty-master',
  templateUrl: './edit-jv-priroty-master.component.html',
  styleUrls: ['./edit-jv-priroty-master.component.scss',
    '../../../../../assets/scss/from-coomon.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class EditJvPrirotyMasterComponent implements OnInit {

  editcompanyForm!: FormGroup;
  localStorageData: any;
  editCompanyId: any;
  companyList: any = [];
  companyname: any;
  partyname: any;
  partyaddress: any;
  pannumber: any;
  gstnumber: any;
  emailid: any;
  phonenumber: any;
  contactname: any;
  contactno: any;
  contactemail: any;
  threshold: any;
  similarwork: any;
  spanofbridge: any;
  anuualturnover: any;
  networth: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private el: ElementRef
  ) {
    this.editcompanyForm = formBuilder.group({
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

  getData(id: string) {
    this.apiservice.getJVMasterDetailList(this.localStorageData.organisation_details[0].id, id).subscribe(data => {
      this.companyList = data.results;
      this.partyname = this.companyList.find((e: { id: string | null; }) => e.id == id).party_name;
      this.partyaddress = this.companyList.find((e: { id: string | null; }) => e.id == id).party_address;
      this.pannumber = this.companyList.find((e: { id: string | null; }) => e.id == id).pan_no;
      this.gstnumber = this.companyList.find((e: { id: string | null; }) => e.id == id).gst_no;
      this.emailid = this.companyList.find((e: { id: string | null; }) => e.id == id).email_id;
      this.phonenumber = this.companyList.find((e: { id: string | null; }) => e.id == id).phone_no;
      this.contactname = this.companyList.find((e: { id: string | null; }) => e.id == id).contact_person_name;
      this.contactno = this.companyList.find((e: { id: string | null; }) => e.id == id).contact_person_phone_no;
      this.contactemail = this.companyList.find((e: { id: string | null; }) => e.id == id).contact_person_email_id;
      this.threshold = this.companyList.find((e: { id: string | null; }) => e.id == id).available_threshold;
      this.similarwork = this.companyList.find((e: { id: string | null; }) => e.id == id).value_of_similar_works;
      this.spanofbridge = this.companyList.find((e: { id: string | null; }) => e.id == id).maximum_span_length_of_bridge_avail;
      this.anuualturnover = this.companyList.find((e: { id: string | null; }) => e.id == id).average_annual_turn_over;
      this.networth = this.companyList.find((e: { id: string | null; }) => e.id == id).net_worth;
    })
  }

  editCompany() {
    if (this.editcompanyForm.valid) {
      let body = {
        organization: this.localStorageData.organisation_details[0].id,
        party_name: this.editcompanyForm.value.party_name,
        party_address: this.editcompanyForm.value.party_address,
        lead_member_name: this.editcompanyForm.value.lead_member_name,
        pan_no: this.editcompanyForm.value.pan,
        gst_no: this.editcompanyForm.value.gst,
        email_id: this.editcompanyForm.value.email,
        phone_no: this.editcompanyForm.value.phone,
        contact_person_name: this.editcompanyForm.value.contact_person_name,
        contact_person_phone_no: this.editcompanyForm.value.contact_person_phone_no,
        contact_person_email_id: this.editcompanyForm.value.contact_person_email_id,
        available_threshold: this.editcompanyForm.value.available_threshold,
        average_annual_turn_over: this.editcompanyForm.value.average_annual_turn_over,
        maximum_span_length_of_bridge_avail: this.editcompanyForm.value.maximum_span_length_of_bridge_avail,
        net_worth: this.editcompanyForm.value.net_worth,
        value_of_similar_works: this.editcompanyForm.value.value_of_similar_works,
      }

      let id = JSON.parse(this.datasharedservice.getLocalData('editJVMaster_id'));
      this.apiservice.editJVMaster(body, id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        if (res.status == 400) {
          this.toastrService.error(res.msg, '', {
            timeOut: 4000,
          });
        } else {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
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
      this.markFormGroupTouched(this.editcompanyForm);
    }
  }

  PANupCase($event: any) {
    this.editcompanyForm.value.pan = this.editcompanyForm.value.pan.toUpperCase()
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
