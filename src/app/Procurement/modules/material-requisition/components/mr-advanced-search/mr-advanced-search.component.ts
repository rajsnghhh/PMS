import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-mr-advanced-search',
  templateUrl: './mr-advanced-search.component.html',
  styleUrls: ['./mr-advanced-search.component.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss']
})
export class MrAdvancedSearchComponent implements OnChanges, OnInit {
  mrAdvancedSearchForm!: FormGroup;
  localStorageData: any;
  projectList: Array<any> = [];
  projectSiteList: Array<any> = [];
  projectStoreList: Array<any> = [];
  userList: Array<any> = [];
  materialTypeList: any;
  materialSubTypeList: any;
  mrAdvancedSearchFormValue: any = {};
  MaterilFilterList: any = []

  dashBoardData: any


  constructor(private fb: FormBuilder,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) {
    this.activeroute.queryParams.subscribe(params => {
      this.dashBoardData = params;
    });
  }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjectList()
    this.getUserList()
    this.getMaterialType();
    this.initmrAdvancedSearchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  initmrAdvancedSearchForm() {
    this.mrAdvancedSearchForm = this.fb.group({
      project: [this.localStorageData.project_data.id, { disabled: true }],
      fromDate: [''],
      toDate: [''],
      siteFrom: [this.localStorageData.site_data.id, { disabled: true }],
      dueDateFrom: [''],
      dueDateTo: [''],
      requestedBy: [''],
      itemGroup: [''],
      requestedFor: [''],
      rejectedVouchers: [''],
      closeMRNotShow: [''],
      onlyCloseMRNotShow: [''],
      materialIssueAgainstMR: [''],
      nextVchGenerated: [''],
      storeSection: [''],
      siteForwardedTo: [''],
      priority: [''],
      MRNo: [''],
      sanctionedBy: [''],
      sanctionedStatus: [''],
      item: [''],
      locationFor: [''],
      entryBy: [''],
      editBy: ['']
    });

    if (this.dashBoardData) {
      if (this.dashBoardData.statusSearch == 'pending_next') {
        this.mrAdvancedSearchFormValue.exclude__status__in = 'cancel,close,rejected'
      } else if (this.dashBoardData.statusSearch == 'rejected') {
        this.mrAdvancedSearchFormValue.status = 'rejected'
      } else if (this.dashBoardData.statusSearch == 'pending_approve') {
        this.mrAdvancedSearchFormValue.status = 'checked'
      } else if (this.dashBoardData.statusSearch == 'corrected') {
        this.mrAdvancedSearchFormValue.version__gt = '1'
      }

      if (this.dashBoardData.financialyear) {
        this.mrAdvancedSearchFormValue.financialyear = this.dashBoardData.financialyear
      }
    }


    this.mrAdvancedSearchForm.value.project = this.localStorageData.project_data.id
    this.mrAdvancedSearchFormValue.project = this.localStorageData.project_data.id
    this.mrAdvancedSearchForm.value.siteFrom = this.localStorageData.site_data.id
    this.mrAdvancedSearchFormValue.site = this.localStorageData.site_data.id
    this.getProjeDependentSiteData()
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');
    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results;

    })
  }


  getProjeDependentSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.mrAdvancedSearchForm.value.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.projectSiteList = data.results;
    })
  }

  getProjeDependentStoreData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site__project', this.mrAdvancedSearchForm.value.project);
    params.set('site', this.mrAdvancedSearchForm.value.siteFrom);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.projectStoreList = data.results;
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

      this.materialTypeList = this.materialTypeList.filter((item: any) => {
        return item.parent != null
      });

    })
  }

  typeChange() {
    let params = new URLSearchParams();
    params.set('id', this.mrAdvancedSearchForm.value.itemGroup);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialSubTypeList = data;

    })
  }
  subTypeChange() {
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', this.mrAdvancedSearchForm.value.itemGroup);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.MaterilFilterList = data2.results;

    })
    // ========= getting materials =========
  }

  onSubmit() {
    let formdata = this.mrAdvancedSearchForm.value
    let requestObj: any = {
      organization_id: this.localStorageData.organisation_details[0].id,
      project: formdata.project,
      site: formdata.siteFrom,
      from_date: formdata.fromDate,
      to_date: formdata.toDate,
      priority: formdata.priority,
      request_code: formdata.MRNo,
      store: formdata.storeSection,
      status: formdata.sanctionedStatus,
      due_from_date: formdata.dueDateFrom,
      due_to_date: formdata.dueDateTo,
      requested_by: formdata.requestedBy,
      requested_material__material_type: formdata.itemGroup,
      requested_material: formdata.item,
      location: formdata.locationFor,
      created_by: formdata.entryBy,
      updated_by: formdata.editBy,
      requested_for_type: formdata.requestedFor,

      site_forwarded_to: formdata.siteForwardedTo,
      sanctioned_by: formdata.sanctionedBy,
    }

    if (formdata.rejectedVouchers) {
      requestObj.rejected_vouchers = formdata.rejectedVouchers
    }
    if (formdata.closeMRNotShow) {
      requestObj.close_mr_not_show = formdata.closeMRNotShow
    }
    if (formdata.onlyCloseMRNotShow) {
      requestObj.only_close_mr_show = formdata.onlyCloseMRNotShow
    }
    if (formdata.materialIssueAgainstMR) {
      requestObj.material_issue_against_mr = formdata.materialIssueAgainstMR
    }
    if (formdata.nextVchGenerated) {
      requestObj.next_vch_generated = formdata.nextVchGenerated
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }


    this.mrAdvancedSearchFormValue = searchdata
  }


  adddNew() {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/mr/create')
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

}
