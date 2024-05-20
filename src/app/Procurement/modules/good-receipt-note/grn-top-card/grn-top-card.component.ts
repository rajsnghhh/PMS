import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../purchase/data-sharing.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grn-top-card',
  templateUrl: './grn-top-card.component.html',
  styleUrls: ['./grn-top-card.component.scss']
})
export class GrnTopCardComponent implements OnInit, OnChanges {
  form: any = {}
  localStorageData: any;
  vendorList: Array<any> = [];
  siteList: any = [];

  @Output() parrentAction = new EventEmitter<any>();
  
  @Input() prefieldData: any;
  @Input() selectedPODetails: any;
  @Input() selectedIndentDetails: any;
  @Input() scope: any;
  

  projectList: any = []
  vendorCurrencyList: Array<any> = [];
  userList: Array<any> = [];
  storeList: any = [];
  disabledEdit = true
  maxbillAmount = 0


  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService,
    private toastrService : ToastrService
  ) {
    this.datasharedservice.getMaxOrderAmount().subscribe(data => {
      this.maxbillAmount = data
    });
  }


  ngOnInit() {        
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewVendorList()
    this.getProjectList()
    this.getVendorCurrencyList()
    this.getUserList()    

    this.form = {
      grn_top_Valid: false,
      project: null,
      site: null,
      store: null,
      request_code: null,
      date: this.setCurrentDate(),
      manual_slip_no: null,
      unload_date: null,
      unload_time: null,
      received_from: null,
      loaded_via: null,
      vendor: null,
      job_site: null,
      party_bill_amt: 0,
      party_bill_no: null,
      bill_date: null,
      cash_payment: false,
      lab_report_no: null,
      e_way_bill_no: null,
      challan_no: null,
      challan_date: null,
      gate_pass_no: null,
      rst_no: null,
      transporter: null,
      other: null,
      lr_no: null,
      lr_date: null,
      carrying_vehicle_no: null,
      reading: null,
      driver_name: null,
      receive_location: null,
      received_by: null,
      arrival_date: null,
      arrival_time: null,
      vendor_currency: null,
      exchange_rate: null,
      remarks: null,
      line_in_bottom: null,
      attachments: []
    };

    

  }

  amountBillValidation() {
    if(this.form.party_bill_amt > this.maxbillAmount) {
      this.toastrService.error('"Party Bill Amount" should not be grater than Total value.', '', {
        timeOut: 2000,
      });
      this.form.party_bill_amt = this.maxbillAmount
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    
    if(this.scope == 'add' && this.selectedPODetails != ''){
      
      // create GRN through PO ==============
      this.form.project = this.selectedPODetails.project
      this.form.site = this.selectedPODetails.site 
      this.form.store = this.selectedPODetails.store 
      this.form.request_code = this.selectedPODetails?.request_code??null 
      this.form.date = this.selectedPODetails?.date??null 
      this.form.manual_slip_no= this.selectedPODetails?.manual_slip_no??null
      this.form.unload_date= this.selectedPODetails?.unload_date??null
      this.form.unload_time= this.selectedPODetails?.unload_time??null
      this.form.received_from= this.selectedPODetails?.received_from??null
      this.form.loaded_via= this.selectedPODetails?.loaded_via??null
      this.form.vendor= this.selectedPODetails?.vendor??null
      this.form.job_site= this.selectedPODetails?.job_site_id??null
      this.form.party_bill_amt = this.selectedPODetails?.party_bill_amt??0
      this.form.party_bill_no= this.selectedPODetails?.party_bill_no??null
      this.form.bill_date= this.selectedPODetails?.bill_date??null
      this.form.cash_payment =this.selectedPODetails?.cash_payment??false
      this.form.lab_report_no= this.selectedPODetails?.lab_report_no??null
      this.form.e_way_bill_no= this.selectedPODetails?.e_way_bill_no??null
      this.form.challan_no= this.selectedPODetails?.challan_no??null
      this.form.challan_date= this.selectedPODetails?.challan_date??null
      this.form.gate_pass_no= this.selectedPODetails?.gate_pass_no??null
      this.form.rst_no= this.selectedPODetails?.rst_no??null
      this.form.transporter= this.selectedPODetails?.transporter??null
      this.form.other= this.selectedPODetails?.other??null
      this.form.lr_no= this.selectedPODetails?.lr_no??null
      this.form.lr_date= this.selectedPODetails?.lr_date??null
      this.form.carrying_vehicle_no= this.selectedPODetails?.carrying_vehicle_no??null
      this.form.reading= this.selectedPODetails?.reading??null
      this.form.driver_name= this.selectedPODetails?.driver_name??null
      this.form.receive_location= this.selectedPODetails?.receive_location??null
      this.form.received_by= this.selectedPODetails?.received_by??null
      this.form.arrival_date= this.selectedPODetails?.arrival_date??null
      this.form.arrival_time= this.selectedPODetails?.arrival_time??null
      this.form.vendor_currency= this.selectedPODetails?.vendor_currency??null
      this.form.exchange_rate= this.selectedPODetails?.exchange_rate??null
      this.form.remarks= this.selectedPODetails?.remarks??null
      this.form.line_in_bottom =this.selectedPODetails?.line_in_bottom??null
      this.getProjeDependentSiteData()
      this.getProjeDependentStoreData()
      
    }
    if(this.scope == 'add' && this.selectedIndentDetails != ''){



      // create GRN through PO ==============
      this.form.project = this.getGRNProject(this.selectedIndentDetails.results,'project_details')
      this.getProjeDependentSiteData()

      this.form.site = this.getGRNProject(this.selectedIndentDetails.results,'site_details')
      this.getProjeDependentStoreData()

      this.form.store = this.getGRNProject(this.selectedIndentDetails.results,'store_details')
     
    }

    if((this.scope == 'update' || this.scope == 'view' || this.scope == 'print') && this.prefieldData) {
        this.form.project = this.prefieldData.project
        this.form.receive_location = this.prefieldData.receive_location
        this.form.indent_no = this.prefieldData.indent_no
        this.form.total_quantity = this.prefieldData.total_quantity
        this.form.purchase_bill_done_qty = this.prefieldData.purchase_bill_done_qty
        this.form.qty_pending_for_pur = this.prefieldData.qty_pending_for_pur
        this.form.grn_no = this.prefieldData.grn_no
        this.form.request_code = this.prefieldData.request_code
        this.form.date = this.prefieldData.date;
        if(this.prefieldData.time){
          this.form.time =  this.setTime(this.prefieldData.time) 
        }
        this.form.manual_slip_no = this.prefieldData.manual_slip_no
        this.form.unload_date = this.prefieldData.unload_date
        this.form.unload_time = this.prefieldData.unload_time
        this.form.loaded_via = this.prefieldData.loaded_via
        this.form.party_bill_amt = this.prefieldData.party_bill_amt
        this.form.lab_report_no = this.prefieldData.lab_report_no
        this.form.e_way_bill_no = this.prefieldData.e_way_bill_no
        this.form.party_bill_no = this.prefieldData.party_bill_no
        this.form.bill_date = this.prefieldData.bill_date
        this.form.cash_payment = this.prefieldData.cash_payment	
        this.form.challan_no = this.prefieldData.challan_no	
        this.form.challan_date = this.prefieldData.challan_date	
        this.form.gate_pass_no = this.prefieldData.gate_pass_no	
        this.form.rst_no = this.prefieldData.rst_no	
        this.form.transporter = this.prefieldData.transporter	
        this.form.other = this.prefieldData.other	
        this.form.lr_no = this.prefieldData.lr_no	
        this.form.lr_date = this.prefieldData.lr_date	
        this.form.carrying_vehicle_no = this.prefieldData.carrying_vehicle_no	
        this.form.reading = this.prefieldData.reading	
        this.form.driver_name = this.prefieldData.driver_name	
        this.form.receive_location = this.prefieldData.receive_location	
        this.form.received_from = this.prefieldData.received_from	
        this.form.arrival_date = this.prefieldData.arrival_date	
        this.form.arrival_time = this.prefieldData.arrival_time	
        this.form.remarks = this.prefieldData.remarks	
        this.form.line_in_bottom = this.prefieldData.line_in_bottom	
        this.form.create_material_issue = this.prefieldData.create_material_issue	
        this.form.exchange_rate = this.prefieldData.exchange_rate	
        this.form.status = this.prefieldData.status 
        this.form.created_by = this.prefieldData.created_by 
        this.form.updated_by = this.prefieldData.updated_by 
        this.form.organization = this.prefieldData.organization 
        this.form.purchase_order = this.prefieldData.purchase_order 
        this.form.store = this.prefieldData.store 
        this.form.job_site = this.prefieldData.job_site 
        this.form.site = this.prefieldData.site 
        this.form.received_by = this.prefieldData.received_by 
        this.form.vendor = this.prefieldData.vendor 
        this.form.vendor_currency = this.prefieldData.vendor_currency 
  
        this.getProjeDependentSiteData()
    }
   

    if(this.scope == 'view' || this.scope == 'print') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }

  getGRNProject(data:any,tokenName:any) {
    let filter = data.filter(((item: { [x: string]: { id: any; }[]; }) => item[tokenName][0]?.id == data[0][tokenName][0]?.id))
    if(data.length == filter.length) {
      return data[0].project_details[0].id
    } else {
      return null
    }
  }

  changeCustomer(vendorId: any) {
    this.form.vendor_currency = this.vendorList.find((data: any) => data.id == vendorId).vendor_master_data?.vendor_currency;
  }


  sendProjectSiteId() {

    let sendProjectSite = {
      projectId: this.form.project,
      siteId: this.form.site
    }
    this.dataService.updateSharedData({ sendProjectSite });
    this.getStoreList();

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
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }

  getProjeDependentSiteData() {
    if(this.form.project) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.form.project);
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
      this.datasharedservice.saveLocalData('selectedProject',this.form.project)
    })
    if(this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
      this.form.site = this.prefieldData.site
      this.getProjeDependentStoreData()
    }
    }
  }

  getProjeDependentStoreData() {
    if(this.form.site && this.form.project) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site__project',this.form.project);
    params.set('site',this.form.site);
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
      this.datasharedservice.saveLocalData('selectedSite',this.form.site)
    })
    if(this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
      this.form.store = this.prefieldData.store
    }
    }
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
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
    })
  }

  setTime(req:any) {
    if(req == '') {
      const today = new Date();
      return today.getHours()+':'+today.getMinutes()
    }else {
      let res = req.split(':')
      return res[0]+ ':' + res[1]
    }
    
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

    this.form.grn_top_Valid = true
    this.parrentAction.emit(JSON.stringify(this.form))
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


