import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

  localStorageData: any
  projectList: any = []
  departmentList: any = []
  siteList: any = []
  storeList: any = []
  userlist: any = []
  masterlist: any = []
  groupMasterlist:any=[];
  materialGroupList: any = []
  uomList: any = []
  selectedIds: any = []
  selectAll: boolean = false;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService
  ) {

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjectList()
    this.getDepartmentList()
    this.getStoreData()
    this.getSiteData()
    this.getUserList()
    this.getmasterList()
    this.getUomList()
    this.getGroupmasterList();
  }
  getGroupmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.groupMasterlist = data.results
    })
  }
  typeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.requested_items[i].MaterilSubGroupList = data.results;
    })
  }

  subTypeChange(typeid: any, i: any){
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

  disabledEdit = true

  getPrefieldData() {
    let params = new URLSearchParams();
    let procurementID = JSON.parse(this.activeroute.snapshot.paramMap.get('mrId') || '{}')
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', procurementID);
    this.procurementApiService.getProcurementMRDetails(params).subscribe(data => {
      this.form = data

      for (let i = 0; i < this.form.requested_items.length; i++) {
        this.form.requested_items[i].requested_material_group=this.form.requested_items[i]?.material_details?.material_type_details[0]?.parent_id;
        this.typeChange(this.form.requested_items[i]?.material_details?.material_type_details[0]?.parent_id,i)
        this.form.requested_items[i].requested_material_sub_group=this.form.requested_items[i]?.material_details?.material_type_details[0]?.id;
        this.subTypeChange(this.form.requested_items[i]?.material_details?.material_type_details[0]?.id,i)
      }
    });
  }

  form: any = {}


  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results
    });
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

  getDepartmentList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getDepartmentList(params).subscribe(data => {
      this.departmentList = data.results;
    })
  }


  getStoreData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })
  }

  getSiteData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userlist = data
    })
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.masterlist = data.results
      this.generateMaterialData()
      this.getPrefieldData()
    })
  }

  backtolist() {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/mr')
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
    params.set('type', 'mr-items');
    this.procurementApiService.updateProcurementSatatus(params,req).subscribe(data => {
      this.backtolist()
    })
  }

  onCheckboxChange(event?: any, itemId?: number) {
    this.selectAll = !this.selectAll;
    if (event?.target.checked || this.selectAll) {
      this.selectedIds.push(itemId);
    } else {
      const index = this.selectedIds.indexOf(itemId);
      if (index !== -1) {
        this.selectedIds.splice(index, 1);
      }
    }
  }

  selectAllRows(ele: any) {
    this.selectAll = !this.selectAll
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

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }



}
