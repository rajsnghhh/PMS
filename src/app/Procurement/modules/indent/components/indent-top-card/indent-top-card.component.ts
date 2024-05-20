import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-indent-top-card',
  templateUrl: './indent-top-card.component.html',
  styleUrls: ['./indent-top-card.component.scss']
})
export class IndentTopCardComponent {
  localStorageData: any;
  storeList: any = [];
  siteList: any = [];

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Output() parrentAction = new EventEmitter<any>();


  form: any = {};
  maxDate:any=''

  disabledEdit = true
  @Input() prefieldData: any;
  @Input() scope: any;
  @Input() isIndent_Approver:any;
  @Input() selectedMRDetails: any;
  newAddScope = true;
  projectList :any = []
  mindate = ''
  departmentList:any = []
  

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private router : Router,
    private datePipe: DatePipe,

  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if(this.scope == 'add' || this.scope == 'create') {
      this.form.project = this.localStorageData.project_data.id
      this.form.site = this.localStorageData.site_data.id
      this.getProjeDependentSiteData()
    }
    if ((this.scope == 'update' || this.scope == 'view' || this.scope=='print') && this.prefieldData?.id) {
      this.form.request_code = this.prefieldData.request_code
      this.form.manual_slip_number = this.prefieldData.manual_slip_number
      this.form.date = this.prefieldData.date
      this.form.time = this.prefieldData.time.substr(0, 5)
      this.form.site = this.prefieldData.site
      this.form.store = this.prefieldData.store
      this.form.department = this.prefieldData.department
      this.form.project = this.prefieldData.project
      this.getProjeDependentSiteData()
    }

    if(!this.isIndent_Approver) {
      this.mindate = this.setCurrentDate()
    }else {
      this.mindate = ''
    }

    if (this.scope == 'view' || this.scope=='print') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
    if (this.router.url.indexOf('/procurement/indent/create') > -1) {
      this.newAddScope = true
    } else {
      this.newAddScope = true
    }
    if(this.scope == 'add' && this.selectedMRDetails.length>0) {
      this.setMrData()
    }
  }

  setMrData() {
    if(this.filterByKey('department_id')) {
      this.form.department = this.selectedMRDetails[0].department_id
    }  
    if(this.filterByKey('project_id')) {
      this.form.project = this.selectedMRDetails[0].project_id
    }  
    if(this.filterByKey('store_id')) {
      this.form.store = this.selectedMRDetails[0].store_id
    }  
    if(this.filterByKey('site_id')) {
      this.form.site = this.selectedMRDetails[0].site_id
    }   
  }

  filterByKey(keyName:any) {
    let filter = this.selectedMRDetails.filter( (item: { [x: string]: any; }) => item[keyName] == this.selectedMRDetails[0][keyName]) 
    if(filter.length == this.selectedMRDetails.length) {
      return true
    } else {
      return false
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjectList();
    this.getDepartmentList()
    this.getSiteList();
    this.getStoreList();
    this.form = {
      indent_top_card: false,
      request_code: '',
      manual_slip_number: '',
      date: this.setCurrentDate(),
      time: this.setCurrentTime(),
      site: '',
      // indent_location:  '',
      store: ''
    };

    var date = new Date();
    this.maxDate = this.datePipe.transform(date, "yyyy-MM-dd");
  }


  getDepartmentList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getDepartmentList(params).subscribe(data => {
      this.departmentList = data.results;
    })
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

  setCurrentTime(): string {
    const now = new Date();
    // Format the time as "HH:mm" (24-hour format)
    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    return `${hours}:${minutes}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }


  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results
    });
  }


  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.selectedMRDetails.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
          })

  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('site__project', this.selectedMRDetails.project);
    // params.set('site', this.selectedMRDetails.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }


  onSubmit(): void {
    this.form.indent_top_card = true;
    JSON.stringify(this.form)
    this.parrentAction.emit(JSON.stringify(this.form))
  }

  getProjeDependentSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.form.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
            this.siteList = data.results;
      this.datasharedservice.setObservableData(this.form)
    })
    if(this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
            this.form.site = this.prefieldData.site
            this.form.store = this.prefieldData.store

      this.siteChange()
    }
  }

  siteChange() {
    // this.datasharedservice.setObservableData(this.form)
    this.getProjeDependentStoreData()
  }

  storeChange() {
    // this.datasharedservice.setObservableData(this.form)
    let filter = this.storeList.filter((item: { id: any; }) => item.id == this.form.store)
    if(filter.length > 0) {
      this.form.site = filter[0].site
      this.siteChange()
    }
    this.datasharedservice.setObservableData(this.form)
  }

  getProjeDependentStoreData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site__project',this.form.project);
    params.set('site',this.form.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
      this.datasharedservice.setObservableData(this.form)
    })
  }


}
