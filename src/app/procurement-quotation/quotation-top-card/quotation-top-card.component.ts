import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-quotation-top-card',
  templateUrl: './quotation-top-card.component.html',
  styleUrls: ['./quotation-top-card.component.scss'],
})
export class QuotationTopCardComponent {
  form: any = {};
  @Input() urlIds: any;
  localStorageData: any;
  vendorList: Array<any> = [];
  setVendorData: Array<any> = [];
  stateList: any = [];
  enquiryList: any;

  @Input() prefieldData: any;

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Output() parrentAction = new EventEmitter<any>();

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.localStorageData = JSON.parse(
      this.datasharedservice.getLocalData('userDATA')
    );

    this.getEnquiryList();
    this.viewVendorList();
    this.getStateList();
  }

  getEnquiryList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('all', 'true');

    this.procurementAPIService.getRfqVendors(params).subscribe((data) => {
      this.enquiryList = data.results;
    });
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData?.organisation_details[0]?.id
    );
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe((data) => {
      this.vendorList = data.results;
      this.generatePrepopulatedData();
    });
  }

  generatePrepopulatedData() {
    if (this.prefieldData) {
      // if coming directly from enquiry and Quotation has not been submitted before =====
     
      setTimeout( () => {
        this.form = {
          quotation_top_Valid: false,
          indent: this.prefieldData?.indent,
          project: this.prefieldData?.project,
          site: this.prefieldData?.site,
          store: this.prefieldData?.store,
          vendor: this.prefieldData?.vendor,
          material_request: this.prefieldData.material_request,
          rfq_vendor: this.prefieldData.rfq_vendor,
          advance_percentage:this.prefieldData.advance_percentage,
          advance_amount:this.prefieldData.advance_amount,
          remarks:this.prefieldData.remarks,
          date: this.setCurrentDate(),
          vendor_quotation_number: this.prefieldData?.vendor_quotation_number
            ? this.prefieldData?.vendor_quotation_number
            : '',
          vendor_state: this.prefieldData?.vendor_state
            ? this.prefieldData?.vendor_state
            : '',
          gst_number: this.prefieldData?.gst_number
            ? this.prefieldData?.gst_number
            : '',
          payment_days: this.prefieldData?.payment_days
            ? this.prefieldData?.payment_days
            : '',
          purchase_type: this.prefieldData?.purchase_type
            ? this.prefieldData?.purchase_type
            : '',
          payment_mode: this.prefieldData?.payment_mode
            ? this.prefieldData?.payment_mode
            : '',
          delivery_days: this.prefieldData?.delivery_days
            ? this.prefieldData?.delivery_days
            : '',
          delivery_state: this.prefieldData?.delivery_state
            ? this.prefieldData?.delivery_state
            : '',
          file: '',
          // store:''
        };

      }, 5000);

    }
  }

  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102');
    this.apiservice.getStateList(countryId).subscribe((data) => {
      this.stateList = data;
    });
  }

  setCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd;
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.form.quotation_top_Valid = true;
    JSON.stringify(this.form, null, 2);
    this.parrentAction.emit(JSON.stringify(this.form, null, 2));
  }

  handleUpload(event: any) {
    this.form.attachments = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' + file.type + ';base64,';
        let data = reader.result?.toString().replace(replacestring, '');
        this.form.attachments.push({
          file_data: data,
          mime_type: file.type,
          organization: this.localStorageData.organisation_details[0].id,
        });
      };
    }
  }
}
