import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharingService } from '../../../purchase/data-sharing.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-work-order-top-card',
  templateUrl: './work-order-top-card.component.html',
  styleUrls: ['./work-order-top-card.component.scss']
})
export class WorkOrderTopCardComponent {
  form: any = {}
  localStorageData: any;
  vendorList: Array<any> = [];
  siteList: any = [];
  projectList: any = []
  stateList: any = []


  @Output() parrentAction = new EventEmitter<any>();

  @Input() prefieldData: any;
  @Input() scope: any;


  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService
  ) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.form = {
      wo_top_Valid: false,
      project: '',
      site: '',
      wo_no: '',
      date: this.setCurrentDate(),
      party: '',
      buyer_order_no: '',
      retention_percentage: 0,
      kind_attn: '',
      location: '',
      billing_site: '',
      sd_percentage: 0,
      work_description: '',
      organization: this.localStorageData?.organisation_details[0]?.id
    }

    this.viewVendorList()
    this.getProjectList()
    this.getStateList()


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

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results
    });
  }

  getProjeDependentSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.form.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
      this.datasharedservice.saveLocalData('selectedProject', this.form.project)
    })
    // if(this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
    //   this.form.site = this.prefieldData.site
    //   this.getProjeDependentStoreData()
    // }

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
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
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
    this.form.wo_top_Valid = true
    JSON.stringify(this.form)
    this.parrentAction.emit(JSON.stringify(this.form))
  }


}
