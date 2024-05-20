import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-check-indent',
  templateUrl: './check-indent.component.html',
  styleUrls: ['./check-indent.component.scss']
})
export class CheckIndentComponent {
  form: any = {}
  projectList: any = []
  departmentList: any = []
  siteList: any = []
  storeList: any = []
  userList: any = []
  materialTypeList: any = []
  disabledEdit = true;
  localStorageData: any
  procurementIndentRequest: any = []
  selectedIds: any = []
  selectAll: boolean = false;
  
  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private activeroute: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getData();
    this.getProjectList();
    this.getDepartmentList()
    this.getSiteList();
    this.getStoreList();
    this.getUserList();
  }

  getData(){
    let indentId= JSON.parse(this.activeroute.snapshot.paramMap.get('indentId') || '{}')

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', indentId);

    this.procurementApiService.getProcurementIndentDetails(params).subscribe(data => {
      this.procurementIndentRequest = data;

      this.form.project = this.procurementIndentRequest.project
      this.form.request_code = this.procurementIndentRequest.request_code
      this.form.manual_slip_number = this.procurementIndentRequest.manual_slip_number
      this.form.date = this.procurementIndentRequest.date
      this.form.time = this.procurementIndentRequest.time.substr(0, 5)
      this.form.site = this.procurementIndentRequest.site
      this.form.store = this.procurementIndentRequest.store
      this.form.department = this.procurementIndentRequest.department

      this.form.line_in_bottom = this.procurementIndentRequest.line_in_bottom
      this.form.remarks = this.procurementIndentRequest.remarks
      this.form.created_by = this.procurementIndentRequest.created_by

      this.form.requested_items = this.procurementIndentRequest.indent_items
      if (this.procurementIndentRequest.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
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

  getDepartmentList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getDepartmentList(params).subscribe(data => {
      this.departmentList = data.results;
    })
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }

  getMaterialParent() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;
    })
  }

  backtolist() {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/indent')
  }

  check() {
    let req = []
    for(let i=0;i<this.selectedIds.length;i++) {
      req.push({
        "id": this.selectedIds[i],
        "status": "checked"
      })
    }

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('type', 'indent-items');
    this.procurementApiService.updateProcurementSatatus(params,req).subscribe(data => {
      this.backtolist()
    })
  }

  onCheckboxChange(event: any, itemId: number) {
    if (event.target.checked || this.selectAll) {
      this.selectedIds.push(itemId);
    } else {
      const index = this.selectedIds.indexOf(itemId);
      if (index !== -1) {
        this.selectedIds.splice(index, 1);
      }
    }
  }

  selectAllRows(ele: any) {
    this.selectAll = !this.selectAll;
    if (this.selectedIds.length && this.selectedIds.length === ele.form.requested_items.length) {
      this.selectedIds = [];
    } else {
      this.selectedIds = ele.form.requested_items.map((item: any) => item.id);
    }
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
  