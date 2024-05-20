import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-mr-top-card',
  templateUrl: './mr-top-card.component.html',
  styleUrls: ['./mr-top-card.component.scss']
})
export class MrTopCardComponent implements OnInit, OnChanges {
  localStorageData: any
  projectList: any = []
  siteList: any = []
  storeList: any = []
  departmentList: any = []
  disabledEdit = true
  mindate = ''
  maxDate: any = '';
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;

  @Output() parrentAction = new EventEmitter<any>();

  @Input() prefieldData: any;
  @Input() scope: any;
  @Input() isMR_Approver: any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private datePipe: DatePipe,
    private commonFunction: CommonFunctionService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if(this.scope == 'add') {
      this.form.project = this.localStorageData.project_data.id
      this.form.site = this.localStorageData.site_data.id
      this.getProjeDependentSiteData()
    }
    if ((this.scope == 'update' || this.scope == 'view' || this.scope == 'print') && this.prefieldData.id) {
      this.form.request_number = this.prefieldData.request_code
      this.form.date = this.prefieldData.date
      this.form.time = this.setTime(this.prefieldData.time)
      this.form.project = this.prefieldData.project
      this.form.site = this.prefieldData.site
      this.form.location = this.prefieldData.location
      this.form.department = this.prefieldData.department
      this.getProjeDependentSiteData()
    }

    if (!this.isMR_Approver) {
      this.mindate = this.setDate()
    } else {
      this.mindate = ''
    }

    if (this.scope == 'view' || this.scope == 'print') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjectList()
    this.getDepartmentList()

    var date = new Date();
    this.maxDate = this.datePipe.transform(date, "yyyy-MM-dd");
  }
  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  form = {
    request_number: '',
    date: this.setDate(),
    time: this.setTime(''),
    project: '',
    site: '',
    store: '',
    location: '',
    department: '',
    mr_TopValid: false
  };

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
    if (this.scope == 'update' || this.scope == 'view' || this.scope == 'print') {
      this.form.store = this.prefieldData.store
    }
  }

  setTime(req: any) {
    if (req == '') {
      const today = new Date();
      return this.commonFunction.doubleDegit(today.getHours()) + ':' + this.commonFunction.doubleDegit(today.getMinutes()) + ':00'
    } else {
      let res = req.split(':')
      return res[0] + ':' + res[1] + ':00'
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
