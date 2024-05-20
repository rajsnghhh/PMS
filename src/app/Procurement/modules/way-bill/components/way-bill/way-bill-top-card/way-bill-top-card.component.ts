import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/Procurement/modules/purchase/data-sharing.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';
import * as Global from 'src/app/global'

@Component({
  selector: 'app-way-bill-top-card',
  templateUrl: './way-bill-top-card.component.html',
  styleUrls: ['./way-bill-top-card.component.scss']
})
export class WayBillTopCardComponent {
  Global = Global;
  formGroup!: FormGroup
  form: any = {}
  stateList: any = [];
  vendorList: Array<any> = [];
  @Output() checkValidation = new EventEmitter<any>();
  @Output() parrentAction = new EventEmitter<any>();
  @Input() checkValidData: boolean = false;
  @Input() wayBillData: any = null;
  @Input() scope: any = null;
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
  ) {

  }
  getFormGroup() {
    return this.formGroup
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      "organization": this.localStorage.organisation_id(),
      "way_bill_form_no": [null, Validators.compose([Validators.required])],
      "is_issued_by_party": [false, Validators.compose([])],
      "vendor": [null, Validators.compose([])],
      "issued_date": [Global.TODAY, Validators.compose([])],
      "is_used_date": [false, Validators.compose([])],
      "used_date": [Global.TODAY, Validators.compose([])],
      "entry_in_state": [null, Validators.compose([])],
      "issue_details": [null, Validators.compose([])],
      "used_details": [null, Validators.compose([])],

    })
    this.viewVendorList()
    this.getStateList()
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.checkValidData) {
      this.onSubmit()
    }
    if(this.wayBillData){
      this.formGroup.patchValue({
      "way_bill_form_no": this.wayBillData?.way_bill_form_no??null,
      "is_issued_by_party":this.wayBillData?.is_issued_by_party??false,
      "vendor":this.wayBillData?.vendor??null,
      "issued_date":this.wayBillData?.issued_date??null,
      "is_used_date": this.wayBillData?.is_used_date??false,
      "used_date": this.wayBillData?.used_date??null,
      "entry_in_state": this.wayBillData?.entry_in_state??null,
      "issue_details": this.wayBillData?.issue_details??null,
      "used_details": this.wayBillData?.used_details??null,
      })
    }
  }
  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102')
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.stateList = data;
    })
  }


  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }




  save() {

    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.formGroup.markAllAsTouched()
    this.checkValidation.emit(this.formGroup.valid)
    if (this.formGroup.valid) {
      this.parrentAction.emit(this.formGroup.value)
    }
  }


}

