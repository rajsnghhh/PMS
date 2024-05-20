import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../data-sharing.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-po-top-card',
  templateUrl: './po-top-card.component.html',
  styleUrls: ['./po-top-card.component.scss']
})
export class PoTopCardComponent implements OnInit, OnChanges {
  form: any = {}
  localStorageData: any;
  termsFromMaster: Array<any> = [];
  vendorList: Array<any> = [];
  siteList: any = [];
  @Input() prefieldData: any;
  @Input() reload: any;
  @Input() scope: any;
  @Input() disableEdit: any;
  @Output() parrentAction = new EventEmitter<any>();
  stateList: any = []
  projectList: any = []
  vendorCurrencyList: Array<any> = [];
  quotationList: any = []
  userList: Array<any> = [];
  storeList: any = [];
  exchangeRateRequired = true

  disableProject = false
  disableSite = false
  disableStore = false
  maxDate:any=''


  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService,
    private datePipe: DatePipe,

  ) { }


  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewVendorList()
    this.getStateList()
    // this.getSiteList();
    this.getProjectList()
    this.getQuotationList();
    this.getVendorCurrencyList()
    this.getUserList()

    var date = new Date();
    this.maxDate = this.datePipe.transform(date, "yyyy-MM-dd");

    this.form = {
      po_top_Valid: false,
      project: '',
      site: '',
      store: '',
      po_code: '',
      po_date: this.setCurrentDate(),
      po_for: '',
      vendor: '',
      valid_date_from: this.setCurrentDate(),
      valid_date_to: this.setCurrentDate(),
      job_site: '',
      line_before_items: '',
      vendor_currency: '',
      exchange_rate: '',
      quotation_text: '',
      quotation_date: null,
      quotation_by_text: '',
      delivery_site: '',
      billing_site: '',
      delivery_address1: '',
      line_in_bottom: '',
      attachments: [],
      delivery_days: 0,
      for_alerts_delivery_days: 0,
      payment_days: 0,
      for_alerts_payment_days: 0,
      po_delivery_loc: [
        { delivery_location: '', contact_person: '', goods_percentage: null, organization: this.localStorageData.organisation_details[0].id }
      ]
    };
    
    

  }

  changeCustomer(vendorId: any) {
    this.form.vendor_currency = this.vendorList.find((data: any) => data.id == vendorId).vendor_master_data?.vendor_currency;
    this.changeCurrency()
  }


  changeCurrency() {
    let filter = this.vendorCurrencyList.filter(item => item.id == this.form.vendor_currency)
    if(filter.length > 0 && filter[0].slug == 'indian_rupee') {
      this.exchangeRateRequired = false
      this.form.exchange_rate = 1
    } else {
      this.form.exchange_rate = 1
      this.exchangeRateRequired =  true
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    if(this.prefieldData.id || this.prefieldData.createThrough) {

      this.form.project = this.prefieldData.project
      this.form.site = this.prefieldData.site
      this.form.store = this.prefieldData.store
      this.form.po_code = this.prefieldData.po_code
      this.form.date = this.prefieldData.date
      this.form.po_for = this.prefieldData.po_for
      this.form.vendor = this.prefieldData.vendor
      this.form.valid_date_from = this.prefieldData.valid_date_from
      this.form.vendor_state = this.prefieldData.vendor_state
      this.form.job_site = this.prefieldData.job_site
      this.form.subject = this.prefieldData.subject
      this.form.purchase_type = this.prefieldData.purchase_type
      this.form.party_bank = this.prefieldData.party_bank
      this.form.billing_site = this.prefieldData.billing_site_details[0].id
      this.form.line_before_items = this.prefieldData.line_before_items
      this.form.delivery_address1 = this.prefieldData.delivery_address1
      if(this.prefieldData.createThrough){
        this.form.vendor_currency = this.prefieldData?.vendor_details?.vendor_currency
      }else{
        this.form.vendor_currency = this.prefieldData?.vendor_currency
      }

      this.form.exchange_rate = this.prefieldData.exchange_rate
      this.form.po_delivery_loc = this.prefieldData.po_delivery_loc
      
      this.form.gst_as_billing_state = this.prefieldData.gst_as_billing_state
      this.form.quotation_text = this.prefieldData.quotation_text
      this.form.quotation_date = this.prefieldData.quotation_date
      this.form.quotation_by_text = this.prefieldData.quotation_by_text
      this.form.line_in_bottom = this.prefieldData.line_in_bottom
      this.form.attachments = this.prefieldData.attachments
      this.getProjeDependentSiteData()
      this.sendProjectSiteId()

    } else {
      if (this.prefieldData.items && this.prefieldData.items.length > 0) {

        if (this.filterByKey('project_details[0].id')) {
          this.form.project = this.prefieldData.items[0].project_details[0].id;
          this.disableProject = true
          this.getProjeDependentSiteData();
        }
  
        if (this.filterByKey('site_details[0].id')) {
          this.form.site = this.prefieldData.items[0].site_details[0].id;
          this.disableSite = true
          this.getStoreList()
        }
        if (this.filterByKey('store_details[0].id')) {
          this.form.store = this.prefieldData.items[0].store_details[0].id
          this.disableStore = true
        }

        this.sendProjectSiteId()

      }
    }
  }

  filterByKey(keyName: any) {
    let filter = this.prefieldData.items.filter((item: { [x: string]: any; }) => item[keyName] == this.prefieldData.items[0][keyName])
    if (filter.length == this.prefieldData.items.length) {
      return true
    } else {
      return false
    }
  }
  

  // onCheckboxChange(): void {
  //   if (this.form.gst_as_billing_state) {
  //     this.form.gst_as_billing_state = true;
  //   } else {
  //     this.form.gst_as_billing_state = false;
  //   }

  // }

  deliverySiteChange(siteId:any){
    this.form.delivery_address1=this.siteList.find((val:any)=>val.id==siteId).address;
  }

  sendProjectSiteId() {

    let sendProjectSite = {
      projectId: this.form.project,
      siteId: this.form.site
    }
    this.dataService.updateSharedData({ sendProjectSite });
    this.getStoreList();

  }

  getQuotationList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.procurementAPIService.getIndentQuotation(params).subscribe((res: any) => {
      this.quotationList = res.results;
    })
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results
    });
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site__project', this.form.project);
    params.set('site', this.form.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }

  getProjeDependentSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.form.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })

  }

  getVendorCurrencyList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.procurementAPIService.getVendorCurrencyList(params).subscribe(data => {
      this.vendorCurrencyList = data.results;

    })
  }



  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
      // this.setVendorData = this.vendorList.find((x: any) => x.id == this.urlIds?.vendor_id)?.vendor_master_data;


    })
  }

  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102')
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.stateList = data;
    })
  }

  // getSiteList() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   // params.set('project', this.selectedMRDetails.project);
  //   params.set('all', 'true');
  //   this.apiservice.getProcurementSiteList(params).subscribe(data => {
  //     this.siteList = data.results;
  //   })

  // }



  addDeliverySiteLocation() {
    this.form.po_delivery_loc.push({ delivery_location: '', contact_person: '', goods_percentage: null, organization: this.localStorageData.organisation_details[0].id }
    );
  }

  deleteDeliverySiteLocation(index: any) {
    this.form.po_delivery_loc.splice(index, 1);
  }

  setCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd
  }


  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit() {
    if(this.form.attachments.length > 0) {
    this.form.po_top_Valid = true
    JSON.stringify(this.form)

    this.parrentAction.emit(JSON.stringify(this.form))
    }
  }


  handleUpload(event: any) {
    this.form.attachments = []

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let replacestring = 'data:' + file.type + ';base64,'
        let data = reader.result?.toString().replace(replacestring, '');
        this.form.attachments.push(
          {
            'file_data': data,
            'mime_type': file.type,
            'organization': this.localStorageData.organisation_details[0].id
          }
        )

      };
    }
  }

}

