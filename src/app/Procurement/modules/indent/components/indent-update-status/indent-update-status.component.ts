import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-indent-update-status',
  templateUrl: './indent-update-status.component.html',
  styleUrls: ['./indent-update-status.component.scss']
})
export class IndentUpdateStatusComponent {
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
  masterlist: any = []
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
        "status": this.form.requested_items[i].status
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
    this.selectAll = !this.selectAll;
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

  setMaterialMasterData(index: number) {
    for (let i = 0; i < this.masterlist.length; i++) {
      if (this.masterlist[i].id == this.form.requested_items[index].requested_material) {
        this.form.requested_items[index].MaterialmasterData = this.masterlist[i]
        this.getProcurementMaterialDetails(index)
        break;
      }
    }
  }

  subTypeChange(typeid: any, i: any) {
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.requested_items[i].MaterilFilterList = data2.results;
      this.setMaterialMasterData(i)
    })
  }
  

  getProcurementMaterialDetails(index: any) {
    if (this.datasharedservice.getLocalData('selectedProject') || this.form.project) {
      let params = new URLSearchParams();
      params.set('id', this.form.requested_items[index].requested_material);
      if (this.datasharedservice.getLocalData('selectedProject')) {
        params.set('project', this.datasharedservice.getLocalData('selectedProject'));
      } else {
        params.set('project', this.form.project);
      }
      this.procurementApiService.getProcurementMaterialDetails(params).subscribe(data => {
        this.form.requested_items[index].MaterialBOQ = data.Data
      })
      this.form.requested_items[index].currentStock = '0'

      let req = new URLSearchParams();
      req.set('organization_id', this.localStorageData.organisation_details[0].id);
      if (this.datasharedservice.getLocalData('selectedSite')) {
        req.set('site', this.datasharedservice.getLocalData('selectedSite'));
      } else {
        req.set('site', this.form.site);
      }
      req.set('material', this.form.requested_items[index].requested_material);

      this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
        this.form.requested_items[index].currentStock = data.results[0]?.total_balance_quantity;
        this.form.requested_items[index].budgeted_qty= data.results[0]?.total_project_quantity;
        this.form.requested_items[index].total_received_uptodate=data.results[0]?.total_recieved_quantity;
        this.form.requested_items[index].stock_on_site=data.results[0]?.quantity;
      })

    } else {
      this.toastrService.error('Project not selected yet!', '', {
        timeOut: 2000,
      });
    }
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

  onSubmit() {
    let req = []
    for (let i = 0; i < this.form.requested_items.length; i++) {
      if (this.form.requested_items[i].status_Update || this.selectAll) {
        req.push({
          "id": this.form.requested_items[i].id,
          "status": this.form.requested_items[i].status,
          "sanctioned_quantity": this.form.requested_items[i].sanctioned_quantity,
          "sanctioned_quantity_uom": this.form.requested_items[i].material_details. unit_of_mesurement_name,
          "priority": this.form.requested_items[i].priority,
          "brand": this.form.requested_items[i].brand,
          "sanctioned_remarks": this.form.requested_items[i].sanctioned_remarks,
        })
      }
    }
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('type', 'indent-items');
    this.procurementApiService.updateProcurementSatatus(params, req).subscribe(data => {
      this.backtolist()
    })
  }

}
