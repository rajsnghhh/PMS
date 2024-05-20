import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-gate-pass-add-top-card',
  templateUrl: './gate-pass-add-top-card.component.html',
  styleUrls: ['./gate-pass-add-top-card.component.scss']
})
export class GatePassAddTopCardComponent {
  localStorageData:any
  projectList:any = []
  siteList:any = []
  storeList:any = []
  departmentList:any = []
  disabledEdit = true
  mindate = ''
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Output() parrentAction = new EventEmitter<any>();

  @Input() prefieldData: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  constructor(
    private datasharedservice : DataSharedService,
    private apiservice : APIService,
    private procurementApiService : PROCUREMENTAPIService
  ) {

  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    if((this.scope == 'update' || this.scope == 'view' || this.scope == 'transportation') && this.prefieldData.id) {      
      
      this.form.gate_pass_no = this.prefieldData.gate_pass_no
      this.form.gate_pass_type = this.prefieldData.gate_pass_type
      this.form.rst_no = this.prefieldData.rst_no
      this.form.date = this.prefieldData.date
      this.form.time =  this.setTime(this.prefieldData.time) 
      this.form.grn_challan_no = this.prefieldData.grn_challan_no
      this.form.chainage_from = this.prefieldData.chainage_from
      this.form.chainage_to = this.prefieldData.chainage_to
      this.form.diff = this.prefieldData.diff
      this.form.type = this.prefieldData.type
      this.form.transporter = this.prefieldData.transporter
      this.form.site = this.prefieldData.site
      this.form.other = this.prefieldData.other
      this.form.tare_weight = this.prefieldData.tare_weight
      this.form.store = this.prefieldData.store
      this.form.driver = this.prefieldData.driver
      this.form.vehicle_no = this.prefieldData.vehicle_no
      this.form.gross_weight = this.prefieldData.gross_weight
      this.form.net_weight = this.prefieldData.net_weight
      this.form.chainage_unit = this.prefieldData.chainage_unit
      this.form.vendor = this.prefieldData.vendor
      this.form.unit = this.prefieldData.unit
    }

    if(!this.isMR_Approver) {
      this.mindate = this.setDate()
    }else {
      this.mindate = ''
    }

    if(this.scope == 'view' || this.scope == 'transportation') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }


  uomList :any = []
  getUOMData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  vendorList :any = []
  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));   
    this.getProjectList() 
    this.getDepartmentList()
    this.getSiteList()
    this.getStoreList()
    this.getUOMData()
    this.viewVendorList()
    this.form.site=this.localStorageData.site_data.id;
  }
  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  form :any = {
    gate_pass_no : '',
    gate_pass_type: '',
    rst_no: '',
    date : this.setDate(),
    time : this.setTime(''),
    grn_challan_no : '',
    site : '',
    type : '',
    other : '',
    transporter:'',
    store:'',
    tare_weight: '',
    driver: '',
    vehicle_no: "",
    gross_weight: "",
    net_weight: "",
    
    vendor: "",
    unit: "",
    financialyear: "",
    chainage_from : '',
    chainage_to : '',
    diff : '',
    chainage_unit: "",
    mr_TopValid:false

  };

  detDiff() {
    if(this.form.chainage_to && this.form.chainage_from) {
      this.form.diff = this.form.chainage_to - this.form.chainage_from
    } else {
      this.form.diff = ''
    }
  }

  getDepartmentList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getDepartmentList(params).subscribe(data => {
      this.departmentList = data.results;
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


  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results
    });
  }

  


  setTime(req:any) {
    if(req == '') {
      const today = new Date();
      return today.getHours()+':'+today.getMinutes()+':00'
    }else {
      let res = req.split(':')
      return res[0]+ ':' + res[1]+ ':' + res[2]
    }
    
  }

  onSubmit(): void {
    this.form.mr_TopValid = true
    JSON.stringify(this.form, null, 2)
    
    this.parrentAction.emit(JSON.stringify(this.form, null, 2))
  }

  // onReset(form: NgForm): void {
  //   form.reset();
  // }
}
