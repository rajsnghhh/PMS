import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-work-order-advance-search',
  templateUrl: './work-order-advance-search.component.html',
  styleUrls: ['./work-order-advance-search.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss']
})
export class WorkOrderAdvanceSearchComponent {
  workOrderAdvancedSearchForm!: FormGroup;
  localStorageData: any;
  workOrderAdvancedSearchFormValue: any;
  vendorList: Array<any> = []
  userList: any = []
  siteList: any = []
  materialTypeList: any;
  materialSubTypeList: any;
  groupTaskList: any = []

  constructor(private fb: FormBuilder,
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.initWOAdvancedSearchForm();
    this.getSiteList();
    this.viewVendorList()
    this.getUserList()
    this.getMaterialType();
    this.getGroupTaskList();
  }


  initWOAdvancedSearchForm() {
    this.workOrderAdvancedSearchForm = this.fb.group({
      date__gte: [''],
      date__lte: [''],
      wo_no: [''],
      site: [''],
      job_site: [''],
      location: [''],
      type: [''],
      updated_by__isnull: [''],
      procurement_work_order_hire_contracts__hire: [''],
      procurement_work_order_hire_contracts__machine_category: [''],
      status: [''],
      party: [''],
      procurement_work_order_materials__material: [''],
      created_at__gte: [''],
      created_at__lte: [''],
      updated_at__gte: [''],
      updated_at__lte: [''],
      created_by: [''],
      updated_by: [''],
      procurement_work_order_details__task__primary: [''],
      procurement_work_order_details__task: [''],
      procurement_work_order_attachments__isnull: ['']
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

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }

  getGroupTaskList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.procurementAPIService.getProcurementGroupTaskDetails(req).subscribe(data => {
      this.groupTaskList = data.results;
    })
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }

  getMaterialType() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;
    })
  }

  addNew() {
    this.router.navigate(['/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/work-order/create'])
  }

  addGST() {
    this.router.navigate(['/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/work-order/GST/create'])
  }

  multistageApproval() {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/work-order/multistage-approval'])
  }

  onSubmit() {
    let formdata = this.workOrderAdvancedSearchForm.value

    let requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,
      date__gte: formdata.date__gte,
      date__lte: formdata.date__lte,
      wo_no: formdata.wo_no,
      site: formdata.site,
      job_site: formdata.job_site,
      location: formdata.status,
      type: formdata.type,
      updated_by__isnull: formdata.updated_by__isnull,
      procurement_work_order_hire_contracts__hire: formdata.procurement_work_order_hire_contracts__hire,
      procurement_work_order_hire_contracts__machine_category: formdata.procurement_work_order_hire_contracts__machine_category,
      status: formdata.status,
      party: formdata.party,
      procurement_work_order_materials__material: formdata.procurement_work_order_materials__material,
      created_at__gte: formdata.created_at__gte,
      created_at__lte: formdata.created_at__lte,
      updated_at__gte: formdata.updated_at__gte,
      updated_at__lte: formdata.updated_at__lte,
      created_by: formdata.created_by,
      updated_by: formdata.updated_by,
      procurement_work_order_details__task__primary: formdata.procurement_work_order_details__task__primary,
      procurement_work_order_details__task: formdata.procurement_work_order_details__task,
      procurement_work_order_attachments__isnull: formdata.procurement_work_order_attachments__isnull
    }

    // if (requestObj.updated_by) {
    //   requestObj.status = 'approved'
    // }
    // if (requestObj.procurement_grn_item__is_royalty == true) {
    //   requestObj.procurement_grn_item__is_royalty = 1
    // }
    // if (requestObj.procurement_grn_item__is_istp == true) {
    //   requestObj.procurement_grn_item__is_istp = 1
    // }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }

    this.workOrderAdvancedSearchFormValue = searchdata
  }

}
