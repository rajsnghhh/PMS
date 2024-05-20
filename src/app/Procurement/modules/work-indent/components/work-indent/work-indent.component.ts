import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { environment } from 'src/environments/environment.prod';
declare var window: any;

@Component({
  selector: 'app-work-indent',
  templateUrl: './work-indent.component.html',
  styleUrls: [
    './work-indent.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class WorkIndentComponent {
  workIndentAdvancedSearchForm!: FormGroup;
  workIndentAdvancedSearchFormValue: any;

  environment = environment
  docUrl = ''

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;

  siteList: Array<any> = [];
  offcanvasAdd:any
  materialGroupList : any = []
  MaterilFilterList :any = []

  workIndentList: Array<any> = [];
  onEditTransportData: any;
  onEditAccess: any = 'add';

  addUpdateWorkIndent: string = 'Add Work Indent';
  deleteTransportRateDetails: any;
  // rackCat: boolean = false;
  workIndent: boolean = false;
  setTransportRateViewList: Array<any> = [];

  @ViewChild('closeButton') closeButton!: ElementRef;
  
  constructor(
    private apiservice: APIService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private fb: FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    
    this.getSiteList()
    this.initWorkIndentAdvancedSearchForm()
    this.getworkIndentList();

    this.offcanvasAdd = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );

    if(this.router.url.indexOf('/procurement/work-indent/add') > -1){
      this.offcanvasAdd.show();
      
    }

    this.docUrl = environment.API_URL1+''
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

  initWorkIndentAdvancedSearchForm() {
    this.workIndentAdvancedSearchForm = this.fb.group({
      date__gte: [''],
      date__lte: [''],
      work_type: [''],
      site: [''],
      procurement_work_indent_details__status: [''],
      
    });
  }

  onSubmit() {
    let formdata = this.workIndentAdvancedSearchForm.value

    let requestObj: any = {}

    requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,

      date__gte: formdata.date__gte,
      date__lte: formdata.date__lte,
      work_type: formdata.work_type,
      site: formdata.site,
      procurement_work_indent_details__status: formdata.procurement_work_indent_details__status,
      
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.workIndentAdvancedSearchFormValue = searchdata

    this.getworkIndentList()
  }

  getworkIndentList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    params.set('site', this.localStorageData?.site_data?.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);

    if (this.workIndentAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.workIndentAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }

    this.procurementApiSevice.getWorkIndentDetails(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.workIndentList = data.results;
      this.workIndent = true;
      
    })
  }

  editMaterialWastage(transport: any, access: any) {
    this.onEditTransportData = transport;
    this.onEditAccess = access;

    if (this.onEditTransportData && access == 'edit') {
      this.addUpdateWorkIndent = 'Edit Work Indent'
    } else if (this.onEditTransportData && access == 'view') {
      this.addUpdateWorkIndent = 'View Work Indent'
    }

  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditTransportData = ''
    this.addUpdateWorkIndent = 'Add Work Indent'
  }

  deleteAlertWastage(rack: any) {
    this.deleteTransportRateDetails = rack;
  }

  deleteMaterialWastage(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.deleteTransportRateDetails.id);
    params.set('method','delete')

    this.procurementApiSevice.deleteWorkIndent(params).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.getworkIndentList();
      
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)

    this.getworkIndentList();
  }
}
