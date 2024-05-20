import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';
import * as Global from 'src/app/global';
import { DataSharingService } from '../../../data-sharing.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
@Component({
  selector: 'app-raw-material-sale-top-card',
  templateUrl: './raw-material-sale-top-card.component.html',
  styleUrls: ['./raw-material-sale-top-card.component.scss'],
})
export class RawMaterialSaleTopCardComponent {
  Global = Global;
  formGroup!: FormGroup;
  form: any = {};
  vendorList: Array<any> = [];
  siteList: any = [];

  @Output() checkValidation = new EventEmitter<any>();
  @Output() parrentAction = new EventEmitter<any>();

  @Input() add_type: any = null;
  @Input() rawMaterialSaleData: any = null;
  @Input() scope: any = null;
  @Input() checkValidData: boolean = false;

  projectList: any = [];
  vendorCurrencyList: Array<any> = [];
  userList: Array<any> = [];
  storeList: any = [];
  stateList: any = [];
  disabledEdit = false;

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  tax_types: any = [
    {
      label: 'GST',
      value: 'gst',
    },
    {
      label: 'VAT',
      value: 'vat',
    },
  ];
  bill_types: any = [
    {
      label: 'EXCISE INVOICE',
      value: 'excise_invoice',
    },
    {
      label: 'HIGH SEAS',
      value: 'high_seas',
    },
    {
      label: 'RETAIL INVOICE',
      value: 'retail_invoice',
    },
    {
      label: 'SERVICE TAX',
      value: 'service_tax',
    },
    {
      label: 'TAX INVOICE',
      value: 'tax_invoice',
    },
  ];
  ADDRESS_TYPE: any = [
    { value: 'account', label: 'Account' },
    { value: 'gst', label: 'GST' },
  ];
  ADDRESS_OF: any = [
    { value: 'site', label: 'Site' },
    { value: 'gst', label: 'GST' },
    { value: 'location', label: 'Location' },
    { value: 'company', label: 'Company' },
  ];
  DISPLAY_DETAILS = [
    { value: 'site', label: 'Site' },
    { value: 'gst', label: 'GST' },
    { value: 'location', label: 'Location' },
  ];
  GST_ON = [
    { value: 'party', label: 'Party' },
    { value: 'buyer', label: 'Buyer' },
  ];
  localStorageData:any;
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService,
    private fb: FormBuilder,
    private router: Router,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private commonfunction: CommonFunctionService
  ) {}
  getFormGroup() {
    return this.formGroup;
  }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjeDependentSiteData();
    this.sendProjectSiteId()

    if (this.add_type == 'gst') {
      this.formGroup = this.fb.group({
        organization: this.localStorage.organisation_id(),
        tax_type: [
          this.add_type ?? 'vat',
          Validators.compose([Validators.required]),
        ],
        project: [null, Validators.compose([Validators.required])],
        site: [null, Validators.compose([Validators.required])],
        store: [null, Validators.compose([Validators.required])],
        bill_type: [null, Validators.compose([Validators.required])],
        party_name: [null, Validators.compose([Validators.required])],
        sale_date: [Global.TODAY, Validators.compose([Validators.required])],
        issue_time: [Global.CURRENT_TIME, Validators.compose([])],
        removal_date: [Global.TODAY, Validators.compose([])],
        removal_time: [Global.CURRENT_TIME, Validators.compose([])],
        rm_sale_voucher_no: [null, Validators.compose([])],
        manual_bill_no: [null, Validators.compose([])],
        invoice_no_prefix: [null, Validators.compose([Validators.required])],
        is_stock_effect: [true, Validators.compose([Validators.required])],
        mfgr_no: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          ]),
        ],
        sale_from_location: [null, Validators.compose([Validators.required])],
        destination: [null, Validators.compose([])],
        transporter: [null, Validators.compose([])],
        manufacturer: [null, Validators.compose([Validators.required])],
        lr_no: [null, Validators.compose([])],
        lr_no_date: [null, Validators.compose([])],
        vehicle_no: [null, Validators.compose([Validators.required])],
        site_state: [null, Validators.compose([Validators.required])],
        party_state: [null, Validators.compose([Validators.required])],
        address_type: [null, Validators.compose([])],
        royalty_no: [null, Validators.compose([])],
        buyer_name: [null, Validators.compose([Validators.required])],
        buyer_state: [null, Validators.compose([Validators.required])],
        job_site: [null, Validators.compose([])],
        show_address_of: [null, Validators.compose([])],
        display_details: [null, Validators.compose([])],
        transport_gst: [null, Validators.compose([])],
        gst_calculation_on: [null, Validators.compose([])],
        eway_bill_no: [null, Validators.compose([])],
        eway_bill_date: [Global.TODAY, Validators.compose([])],
      });
      this.getStateList();
    } else {
      this.formGroup = this.fb.group({
        organization: this.localStorage.organisation_id(),
        tax_type: [
          this.add_type ?? 'vat',
          Validators.compose([Validators.required]),
        ],
        project: [null, Validators.compose([Validators.required])],
        site: [null, Validators.compose([Validators.required])],
        store: [null, Validators.compose([Validators.required])],
        bill_type: [null, Validators.compose([Validators.required])],
        party_name: [null, Validators.compose([Validators.required])],
        sale_date: [Global.TODAY, Validators.compose([Validators.required])],
        issue_time: [
          Global.CURRENT_TIME,
          Validators.compose([Validators.required]),
        ],
        removal_date: [Global.TODAY, Validators.compose([Validators.required])],
        removal_time: [
          Global.CURRENT_TIME,
          Validators.compose([Validators.required]),
        ],
        rm_sale_voucher_no: [null, Validators.compose([])],
        manual_bill_no: [null, Validators.compose([])],
        invoice_no_prefix: [null, Validators.compose([Validators.required])],
        is_stock_effect: [true, Validators.compose([Validators.required])],
        mfgr_no: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          ]),
        ],
        sale_from_location: [null, Validators.compose([Validators.required])],
        destination: [null, Validators.compose([Validators.required])],
        transporter: [null, Validators.compose([Validators.required])],
        manufacturer: [null, Validators.compose([Validators.required])],
        lr_no: [null, Validators.compose([])],
        lr_no_date: [null, Validators.compose([])],
        vehicle_no: [null, Validators.compose([Validators.required])],
      });
    }
    this.viewVendorList();
    this.getProjectList();
    this.getVendorCurrencyList();
    this.getUserList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.checkValidData) {
      this.onSubmit();
    }
    if (this.rawMaterialSaleData) {
      let item = this.rawMaterialSaleData;
      if (this.add_type == 'gst') {
        this.formGroup.patchValue({
          tax_type: item?.tax_type ?? null,
          project: item?.project ?? null,
          site: item?.site ?? null,
          store: item?.store ?? null,
          bill_type: item?.bill_type ?? null,
          party_name: item?.party_name ?? null,
          sale_date: item?.sale_date ?? null,
          issue_time: item?.issue_time ?? null,
          removal_date: item?.removal_date ?? null,
          removal_time: item?.removal_time ?? null,
          rm_sale_voucher_no: item?.rm_sale_voucher_no ?? null,
          manual_bill_no: item?.manual_bill_no ?? null,
          invoice_no_prefix: item?.invoice_no_prefix ?? null,
          is_stock_effect: item?.is_stock_effect ?? false,
          mfgr_no: item?.mfgr_no ?? null,
          sale_from_location: item?.sale_from_location ?? null,
          destination: item?.destination ?? null,
          transporter: item?.transporter ?? null,
          manufacturer: item?.manufacturer ?? null,
          lr_no: item?.lr_no ?? null,
          lr_no_date: item?.lr_no_date ?? null,
          vehicle_no: item?.vehicle_no ?? null,
          site_state: item?.site_state ?? null,
          party_state: item?.party_state ?? null,
          address_type: item?.address_type ?? null,
          royalty_no: item?.royalty_no ?? null,
          buyer_name: item?.buyer_name ?? null,
          buyer_state: item?.buyer_state ?? null,
          job_site: item?.job_site ?? null,
          show_address_of: item?.show_address_of ?? null,
          display_details: item?.display_details ?? null,
          transport_gst: item?.transport_gst ?? null,
          gst_calculation_on: item?.gst_calculation_on ?? null,
          eway_bill_no: item?.eway_bill_no ?? null,
          eway_bill_date: item?.eway_bill_date ?? null,
        });
      } else {
        this.formGroup.patchValue({
          tax_type: item?.tax_type ?? null,
          project: item?.project ?? null,
          site: item?.site ?? null,
          store: item?.store ?? null,
          bill_type: item?.bill_type ?? null,
          party_name: item?.party_name ?? null,
          sale_date: item?.sale_date ?? null,
          issue_time: item?.issue_time ?? null,
          removal_date: item?.removal_date ?? null,
          removal_time: item?.removal_time ?? null,
          rm_sale_voucher_no: item?.rm_sale_voucher_no ?? null,
          manual_bill_no: item?.manual_bill_no ?? null,
          invoice_no_prefix: item?.invoice_no_prefix ?? null,
          is_stock_effect: item?.is_stock_effect ?? false,
          mfgr_no: item?.mfgr_no ?? null,
          sale_from_location: item?.sale_from_location ?? null,
          destination: item?.destination ?? null,
          transporter: item?.transporter ?? null,
          manufacturer: item?.manufacturer ?? null,
          lr_no: item?.lr_no ?? null,
          lr_no_date: item?.lr_no_date ?? null,
          vehicle_no: item?.vehicle_no ?? null,
          site_state: item?.site_state ?? null,
          party_state: item?.party_state ?? null,
          address_type: item?.address_type ?? null,
          royalty_no: item?.royalty_no ?? null,
          buyer_name: item?.buyer_name ?? null,
          buyer_state: item?.buyer_state ?? null,
          job_site: item?.job_site ?? null,
          show_address_of: item?.show_address_of ?? null,
          display_details: item?.display_details ?? null,
          transport_gst: item?.transport_gst ?? null,
          gst_calculation_on: item?.gst_calculation_on ?? null,
          eway_bill_no: item?.eway_bill_no ?? null,
          eway_bill_date: item?.eway_bill_date ?? null,
        });
      }
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorage.organisation_id());
      params.set('id', item?.site);
      this.apiservice.getProcurementSiteList(params).subscribe((data) => {
        this.formGroup.patchValue({
          project: data?.project,
          site: data?.id,
        });
        this.getProjeDependentSiteData();
        this.getStoreList();
      });
    }
  }


  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102');
    this.apiservice.getStateList(countryId).subscribe((data) => {
      this.stateList = data;
    });
  }
  
  sendProjectSiteId() {
    let sendProjectSite = {
      projectId: this.localStorageData?.project_data?.id,
      siteId: this.localStorageData?.site_data?.id,
    };
    this.dataService.updateSharedData({ sendProjectSite });
    this.getStoreList();
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe((data) => {
      this.projectList = data.results;
    });
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('site__project', this.localStorageData?.project_data?.id);
    params.set('site', this.localStorageData?.site_data?.id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    });
  }

  getProjeDependentSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('project', this.localStorageData?.project_data?.id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe((data) => {
      this.siteList = data.results;
      // this.datasharedservice.saveLocalData('selectedProject', this.formGroup.value.project)
    });
    // if (this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
    //   this.formGroup.value.site = this.prefieldData.site
    //   this.getProjeDependentStoreData()
    // }
  }

  getProjeDependentStoreData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('site__project', this.formGroup.value.project);
    params.set('site', this.formGroup.value.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
      this.datasharedservice.saveLocalData(
        'selectedSite',
        this.formGroup.value.site
      );
    });
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    this.apiservice.getAllUserList(params).subscribe((data) => {
      this.userList = data;
    });
  }

  getVendorCurrencyList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    this.procurementAPIService
      .getVendorCurrencyList(params)
      .subscribe((data) => {
        this.vendorCurrencyList = data.results;
      });
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe((data) => {
      this.vendorList = data.results;
    });
  }
  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    this.checkValidation.emit(this.formGroup.valid);
    if (this.formGroup.valid) {
      this.parrentAction.emit(this.formGroup.value);
    }
  }
}
