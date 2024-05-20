import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-indent-advanced-search',
  templateUrl: './indent-advanced-search.component.html',
  styleUrls: [
    './indent-advanced-search.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class IndentAdvancedSearchComponent {
  indentAdvancedSearchForm!: FormGroup;
  localStorageData: any;
  projectList: Array<any> = [];
  projectSiteList: Array<any> = [];
  projectStoreList: Array<any> = [];
  userList: Array<any> = [];
  materialTypeList: any;
  materialSubTypeList: any;
  MaterilFilterList:any;
  dashBoardData:any;
  indentAdvancedSearchFormValue: any = {};

  constructor(private fb: FormBuilder,
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private activeroute : ActivatedRoute,
    private router : Router
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
    this.initIndentAdvancedSearchForm();
  }


  initIndentAdvancedSearchForm() {
    this.indentAdvancedSearchForm = this.fb.group({
      project: [this.localStorageData.project_data.id,{disabled: true}],
      fromDate: [''],
      toDate: [''],
      siteFrom: [this.localStorageData.site_data.id, {disabled: true}],
      dueDateFrom: [''],
      dueDateTo: [''],
      siteForwarded: [''],
      indentBy: [''],
      itemGroup: [''],
      itemsubGroup:[''],
      storeSection: [''],
      requestedFor: [''],
      indentNo: [''],
      site: [''],
      priority: [''],
      nextVchGenerated: [''],
      location: [''],
      sanctionBy: [''],
      item: [''],
      indentFor: [''],
      createdBy: [''],
      editBy: ['']
    });

    if (this.dashBoardData) {
      if (this.dashBoardData.statusSearch == 'pending_next') {
        this.indentAdvancedSearchFormValue.exclude__status__in = 'cancel,close,rejected'
      } else if (this.dashBoardData.statusSearch == 'rejected') {
        this.indentAdvancedSearchFormValue.status = 'rejected'
      } else if (this.dashBoardData.statusSearch == 'pending_approve') {
        this.indentAdvancedSearchFormValue.status = 'checked'
      } else if (this.dashBoardData.statusSearch == 'corrected') {
        this.indentAdvancedSearchFormValue.version__gt = '1'
      }

      if (this.dashBoardData.financialyear) {
        this.indentAdvancedSearchFormValue.indent__financialyear = this.dashBoardData.financialyear
      }
    }
    
    this.indentAdvancedSearchForm.value.project = this.localStorageData.project_data.id
    this.indentAdvancedSearchFormValue.indent__site__project = this.localStorageData.project_data.id
    this.indentAdvancedSearchForm.value.siteFrom = this.localStorageData.site_data.id
    this.indentAdvancedSearchFormValue.indent__site = this.localStorageData.site_data.id
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
    params.set('project', this.indentAdvancedSearchForm.value.project);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.projectSiteList = data.results;
    })
  }

  getProjeDependentStoreData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site__project', this.indentAdvancedSearchForm.value.project);
    params.set('site', this.indentAdvancedSearchForm.value.siteFrom);
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
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;
    })
  }

  setMaterialSubGroup() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', this.indentAdvancedSearchForm.value.itemGroup);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialSubTypeList = data.results;      
    })
  }

  typeChange() {
    let params2 = new URLSearchParams();
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', this.indentAdvancedSearchForm.value.itemsubGroup);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.MaterilFilterList = data2.results;
    })
  }


  onSubmit() {

    let formdata = this.indentAdvancedSearchForm.value

    let requestObj = {
      organization_id: this.localStorageData.organisation_details[0].id,
      indent__site__project: formdata.project,
      created_at__gt: formdata.fromDate,
      created_at__lt: formdata.toDate,
      indent__site: formdata.siteFrom,
      due_date__gt: formdata.dueDateFrom,
      due_date__lt: formdata.dueDateTo,
      // siteForwarded: formdata.siteForwarded,
      indent__created_by: formdata.indentBy,
      requested_material__material_type: formdata.itemGroup,
      indent__store: formdata.storeSection,
      // requestedFor: formdata.requestedFor,
      indent__request_code__icontains: formdata.indentNo,
      // site: formdata.site,
      priority: formdata.priority,
      // nextVchGenerated: formdata.nextVchGenerated,
      indent__site__location__icontains: formdata.location,
      indent__updated_by: formdata.sanctionBy, //sanction by status will be approved
      status: '',
      requested_material: formdata.item,
      // indentFor: formdata.indentFor,
      created_by: formdata.createdBy,
      updated_by: formdata.editBy
    }

    if (requestObj.indent__updated_by) {
      requestObj.status = 'approved'
    }

    let searchdata: any = {}
    for (const [key, value] of Object.entries(requestObj)) {
      if (value != "") {
        searchdata[key] = value
      }
    }


    this.indentAdvancedSearchFormValue = searchdata

    
  }
  
  adddNew() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/create')
  }

  multistageApproval() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/multistage-approval')
  }

  RouteToRoll(route: any) {
    if(route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }


}
