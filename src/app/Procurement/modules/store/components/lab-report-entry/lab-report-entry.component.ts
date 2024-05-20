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
  selector: 'app-lab-report-entry',
  templateUrl: './lab-report-entry.component.html',
  styleUrls: [
    './lab-report-entry.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class LabReportEntryComponent {
  labReportEntryAdvancedSearchForm!: FormGroup;
  labReportEntryAdvancedSearchFormValue: any;

  environment = environment
  docUrl = ''

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;

  materialGroupList : any = []
  MaterilFilterList :any = []
  offcanvasAdd:any
  labreportList: Array<any> = [];
  onEditTransportData: any;
  onEditAccess: any = 'add';

  storeList: any = [];
  PnEmasterlist: any = []


  addUpdateMaterialWastage: string = 'Add Lab Report';
  deleteTransportRateDetails: any;
  // rackCat: boolean = false;
  labReport: boolean = false;
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

    this.getStoreList()
    this.getPnEmasterList()
    this.getmasterList()
    this.getItems()
    this.initSingleLogBookMachineAdvancedSearchForm()
    this.labReportEntryList();

    this.offcanvasAdd = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );
    if(this.router.url=='/pms/store/lab-report-entry/add'){
      this.offcanvasAdd.show();
    }
    this.docUrl = environment.API_URL1+''
  }

  

  getPnEmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getPlantMachineryList(params).subscribe(data => {
      this.PnEmasterlist = data.results
    })
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('site__project', this.form.project);
    // params.set('site', this.form.site);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })
  }

  initSingleLogBookMachineAdvancedSearchForm() {
    this.labReportEntryAdvancedSearchForm = this.fb.group({
      date__gte: [''],
      date__lte: [''],
      item_group__in: [''],
      request_code__icontains: [''],
      
    });
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialGroupList = data.results
      this.materialGroupList = this.materialGroupList.filter((item: any)=>{
        return item.parent != null
      })
      
    })
  }

  getItems(){
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.MaterilFilterList = data2.results;
    })
  }

  onSubmit() {
    let formdata = this.labReportEntryAdvancedSearchForm.value

    let requestObj: any = {}

    requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,

      date__gte: formdata.date__gte,
      date__lte: formdata.date__lte,
      item_group__in: formdata.item_group__in,
      request_code__icontains: formdata.request_code__icontains,
      
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.labReportEntryAdvancedSearchFormValue = searchdata

    this.labReportEntryList()
  }

  labReportEntryList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('page_size', '1000');

    if (this.labReportEntryAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.labReportEntryAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }

    this.procurementApiSevice.getLabReportDetails(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.labreportList = data.results;
      this.labReport = true;
      
    })
  }

  editMaterialWastage(transport: any, access: any) {
    this.onEditTransportData = transport;
    this.onEditAccess = access;

    if (this.onEditTransportData && access == 'edit') {
      this.addUpdateMaterialWastage = 'Edit Lab Report'
    } else if (this.onEditTransportData && access == 'view') {
      this.addUpdateMaterialWastage = 'View Lab Report'
    }

  }

  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditTransportData = ''
    this.addUpdateMaterialWastage = 'Add Lab Report'
  }

  deleteAlertWastage(rack: any) {
    this.deleteTransportRateDetails = rack;
  }

  deleteLabReportEntry(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.deleteTransportRateDetails.id);
    params.set('method','delete')

    this.procurementApiSevice.deleteLabReportEntry(params).subscribe((res: any) => {
      
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });

      this.closeModal();
      this.labReportEntryList();
      
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

    this.labReportEntryList();
  }
}
