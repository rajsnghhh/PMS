import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-plant-prod-top-card',
  templateUrl: './plant-prod-top-card.component.html',
  styleUrls: ['./plant-prod-top-card.component.scss']
})
export class PlantProdTopCardComponent implements OnInit {
  mindate:any = ''
  maxdate:any = ''
  disabledEdit = false;
  localStorageData: any;
  projectList: any = [];
  siteList: any = [];
  storeList: any = [];
  form = {
    project: '',
    site: '',
    store: '',
    location: '',
    request_code: '',
    sale_date:this.setDate(),
    vehicle_number: '',
    manual_slip_number: '',
    receive_date:this.setDate(),
    receive_reading: '',
    plant_prod_TopValid: false
  };

  @Input() prefieldData: any;
  @Input() scope: any;

  @Output() parentAction = new EventEmitter<any>();

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private apiservice: APIService,
    private toastrService:ToastrService,
    private datasharedservice: DataSharedService,
    private procurementApiService:PROCUREMENTAPIService
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjectList()

    this.form.project=this.localStorageData.project_data.id
    this.getProjeDependentSiteData()
    this.form.site=this.localStorageData.site_data.id
    this.getProjeDependentStoreData()
    this.mindate = this.localStorageData.financial_year[0].start_date;
    this.maxdate = this.localStorageData.financial_year[0].end_date;
  }

  ngOnChanges(): void {
    if ((this.scope == 'update' || this.scope == 'view' || this.scope == 'print') && this.prefieldData.id) {
      this.form.project = this.prefieldData.project
      this.form.site = this.prefieldData.site
      this.form.store = this.prefieldData.store
      this.form.request_code = this.prefieldData.request_code
      this.form.sale_date = this.prefieldData.sale_date
      this.form.vehicle_number = this.prefieldData.vehicle_number
      this.form.manual_slip_number = this.prefieldData.manual_slip_number
      this.form.receive_date = this.prefieldData.receive_date
      this.form.receive_reading = this.prefieldData.receive_reading
      this.getProjeDependentSiteData()
    }

    if (this.scope == 'view') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
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
    this.getProjeDependentStoreData()
  }

  getProjeDependentStoreData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site__project', this.form.project);
    // params.set('site',this.form.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
      this.datasharedservice.saveLocalData('selectedSite', this.form.site)
    })
    // if (this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
    //   this.form.store = this.prefieldData.store
    // }
  }

  setDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1;
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

  onSubmit(){
    this.form.plant_prod_TopValid = true;
    JSON.stringify(this.form, null, 2)
    this.parentAction.emit(JSON.stringify(this.form, null, 2))
  }
}
