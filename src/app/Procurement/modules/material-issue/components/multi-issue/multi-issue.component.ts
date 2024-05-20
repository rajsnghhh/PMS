import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-multi-issue',
  templateUrl: './multi-issue.component.html',
  styleUrls: ['./multi-issue.component.scss']
})
export class MultiIssueComponent implements OnInit{

  localStorageData :any 
  constructor(
    private router: Router,
    private activeroute : ActivatedRoute,
    private apiservice : APIService,
    private datasharedservice : DataSharedService,
    private procurementApiService : PROCUREMENTAPIService,
    private toastrService : ToastrService
  ) {

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getmasterList()
    this.getUomList()
    this.getSiteList()
    this.getProjectList()
    this.getUserList()
    this.getStoreList()
    this.form.site=this.localStorageData.site_data.id;
  }

  backtolist() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/material-issue')
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

  scope = 'add'
  disabledEdit = false
  uomList : any = []
  masterlist: any = []
  siteList : any = []
  projectList : any = []
  userList :any = []

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })

  }

  form :any = {
    requested_items : [],
    issue_datas : []
  }

  onSubmit() {
    if(this.form.requested_items.length == 0 ) {
      this.toastrService.error('Please select Items to Proceed!', '', {
        timeOut: 2000,
      });
    } else {
      this.form.issue_datas = this.form.requested_items
      this.createMaterialIssue()
    }
  }

  createMaterialIssue() {
    this.form.issue_datas = this.form.requested_items
    delete this.form.requested_items; 
    this.form.site = parseInt(this.form.site)
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.procurementApiService.addMultipleIssue(params,this.form).subscribe(data => {
      this.toastrService.success('Multiple issue Added!', '', {
        timeOut: 2000,
      });
      this.backtolist()
    })
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
    })
  }

  setMaterialMasterData(index:number,autoPopulateScope:boolean) {
    for(let i=0;i<this.masterlist.length;i++) {
      if(this.masterlist[i].id == this.form.requested_items[index].requested_material) {
        this.form.requested_items[index].MaterialmasterData = this.masterlist[i]
        this.getProcurementMaterialDetails(index,autoPopulateScope)
        if(autoPopulateScope) {
          this.form.requested_items[index].requested_material_group = this.masterlist[i].material_type_name
          this.form.requested_items[index].requested_material_sub_group = this.masterlist[i].material_sub_type_name
        }
        break;
      }
    }
  }

  
  storeList : any = []
  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })
  }


  getProcurementMaterialDetails(index:any,autoPopulateScope:boolean) {

    if(this.datasharedservice.getLocalData('selectedProject') || this.form.project) {
      let params = new URLSearchParams();
      params.set('id', this.form.requested_items[index].requested_material);
      if(this.datasharedservice.getLocalData('selectedProject')) {
        params.set('project', this.datasharedservice.getLocalData('selectedProject'));
      }else {
        params.set('project', this.form.project);
      }
      this.procurementApiService.getProcurementMaterialDetails(params).subscribe(data => {
        this.form.requested_items[index].MaterialBOQ = data.Data 
        this.form.requested_items[index].total_received_uptodate = (data.results[0]?.total_recieved_quantity) ? (data.results[0]?.total_recieved_quantity) : 0      
        this.form.requested_items[index].budgeted_qty = (data.results[0]?.total_project_quantity) ? (data.results[0]?.total_project_quantity) : 0
        this.form.requested_items[index].currentStock = (data.results[0]?.total_balance_quantity)? (data.results[0]?.total_balance_quantity) : 0       
      })
      this.form.requested_items[index].currentStock = '0'

      let req = new URLSearchParams();
      req.set('organization_id', this.localStorageData.organisation_details[0].id);
      if(this.datasharedservice.getLocalData('selectedSite')) {
        req.set('site', this.datasharedservice.getLocalData('selectedSite'));
      }else {
        req.set('site', this.form.site);
      }
      req.set('material', this.form.requested_items[index].requested_material);

      this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
      
        this.form.requested_items[index].stock_on_site = (data.results[0]?.quantity)? (data.results[0]?.quantity) : 0
        
      })
      
    }else {
      this.toastrService.error('Project not selected yet!', '', {
        timeOut: 2000,
      });
    }
  }


  
  delete(index: any) {
    this.form.requested_items.splice(index, 1);
  }

  addItem() {
    this.form.requested_items.push({
      organization : this.localStorageData.organisation_details[0].id,
      is_returnable : false
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
    let params2 = new URLSearchParams();
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.requested_items[i].MaterilFilterList = data2.results;
    })
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
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

}
