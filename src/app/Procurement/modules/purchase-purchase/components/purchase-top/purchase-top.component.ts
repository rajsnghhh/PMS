import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-purchase-top',
  templateUrl: './purchase-top.component.html',
  styleUrls: ['./purchase-top.component.scss']
})
export class PurchaseTopComponent implements OnInit, OnChanges {
  localStorageData:any
  // projectList:any = []
  siteList:any = []
  storeList:any = []
  departmentList:any = []
  disabledEdit = true
  mindate = ''
  exchangeRateRequired = true

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Output() parrentAction = new EventEmitter<any>();

  @Input() prefieldData: any;
  @Input() scope: any;
  @Input() gstScope: any;
  @Input() isPurchase_Approver: any;
  @Input() reload: any;


  constructor(
    private datasharedservice : DataSharedService,
    private apiservice : APIService,
    private procurementApiservice : PROCUREMENTAPIService,
    private commonFunction : CommonFunctionService,
    private activeroute : ActivatedRoute
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA')); 
    if(((this.scope == 'update' || this.scope == 'view' || this.scope == 'print') && this.prefieldData.id)|| this.activeroute.snapshot.paramMap.get('grnID')) {      
      this.form.request_number = this.prefieldData.request_code
      this.form.date = this.prefieldData.date
      this.form.party_bill_date = this.prefieldData.party_bill_date
      this.form.party_bill_no = this.prefieldData.party_bill_no
      this.form.job_site = this.prefieldData.job_site
      this.form.way_bill_form = this.prefieldData.way_bill_form

      this.form.cash_payment = this.prefieldData.cash_payment
      this.form.against_c_form = this.prefieldData.against_c_form
      this.form.cst_agst_e1_sale = this.prefieldData.cst_agst_e1_sale

      this.form.time =  this.setTime(this.prefieldData.time) 
      this.form.job_site = this.prefieldData.site
      this.form.store = this.prefieldData.store
      this.form.location = this.prefieldData.location
      this.form.vendor = this.prefieldData.vendor
      this.form.vendor_currency = this.prefieldData.vendor_currency
      this.form.vendor_state = this.prefieldData.vendor_state
      this.form.site_state = this.prefieldData.site_state
      this.form.exchange_rate = this.prefieldData.exchange_rate
      this.getProjeDependentSiteData()
      this.setIGSTsource()
      this.setIGSTdestiny()
      if(this.prefieldData.site){
        this.changeSite(this.prefieldData.site)
      }
    }

    if(!this.isPurchase_Approver) {
      this.mindate = this.setDate()
    }else {
      this.mindate = ''
    }

    if(this.scope == 'view' || this.scope == 'print') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
    if(this.gstScope) {
      this.getCurrencyList()
      this.getStateList()
    }
  }

  changeCustomer(vendorId: any) {
    this.form.vendor_currency = this.vendorList.find((data: any) => data.id == vendorId).vendor_master_data?.vendor_currency;
    this.form.vendor_state = this.vendorList.find((data: any) => data.id == vendorId).vendor_master_data?.state;
    this.setIGSTsource()
    this.changeCurrency()
  }
  

  changeCurrency() {
    let filter = this.currencyList.filter((item: { id: any; }) => item.id == this.form.vendor_currency)
    if(filter.length > 0 && filter[0].slug == 'indian_rupee') {
      this.exchangeRateRequired = false
      this.form.exchange_rate = 1
    } else {
      this.form.exchange_rate = 1
      this.exchangeRateRequired =  true
    }
  }


  changeSite(siteId:any){
    this.form.site_state=this.siteList.find((data:any)=>data.id==siteId).state
    this.setIGSTdestiny()
  }

 
  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));   
    // this.getProjectList() 
    this.getwayBillList()
    // this.getDepartmenList()
    this.getProjeDependentSiteData()
    this.getvendor()
    this.setIGSTsource()
    this.setIGSTdestiny()
  }
  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  setIGSTsource() {
    this.datasharedservice.setSourceState(this.form.vendor_state)
  }

  setIGSTdestiny() {
    this.datasharedservice.setDestinyState(this.form.site_state)
  }

  currencyList:any = []
  getCurrencyList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getCurrencyList(params).subscribe(data => {
      this.currencyList = data.results;
    })
  }
  statelist:any = []
  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102')
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.statelist = data;
    })
  }

  vendorList :any = []
  getvendor(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }

  form : any = {
    request_number : '',
    date : this.setDate(),
    party_bill_no : '',
    party_bill_date :  this.setDate(),
    time : this.setTime(''),
    way_bill_form : '',
    site:'',
    site_state: null,
    job_site: '',
    store:'',
    location : '',
    vendor: '',
    vendor_currency: null,
    vendor_state : null,
    cash_payment : false,
    cst_agst_e1_sale : false,
    against_c_form : false,
    exchange_rate:0,
    purchase_TopValid:false
  };

  


  wayBillList:any = []
  getwayBillList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiservice.getWayBillList('?'+params).subscribe(data => {
      this.wayBillList = data.results;
    })
  }

  setDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm:any = today.getMonth() + 1; // Months start at 0!
    let dd:any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd
  }


 

  getProjeDependentSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.form.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
      // this.datasharedservice.saveLocalData('selectedProject',this.form.project)
    })
    // if(this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
    //   this.form.site = this.prefieldData.site
    //   this.getProjeDependentStoreData()
    // }
    this.getProjeDependentStoreData()
  }

  getProjeDependentStoreData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('site__project',this.form.project);
    // params.set('site',this.form.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })
    if(this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
      this.form.store = this.prefieldData.store
    }
  }

  setTime(req:any) {
    if(!req) {
      const today = new Date();
      return this.commonFunction.doubleDegit(today.getHours())+':'+ this.commonFunction.doubleDegit(today.getMinutes()) + ':00'
    }
    if(req == '') {
      const today = new Date();
      return this.commonFunction.doubleDegit(today.getHours())+':'+ this.commonFunction.doubleDegit(today.getMinutes()) + ':00'
    }else {
      let res = req.split(':')
      return res[0]+ ':' + res[1] + ':00'
    }
    
  }

  onSubmit(): void {
    this.form.purchase_TopValid = true
    JSON.stringify(this.form, null, 2)
    this.parrentAction.emit(JSON.stringify(this.form, null, 2))
  }

  // onReset(form: NgForm): void {
  //   form.reset();
  // }
}
