import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-bulk-transfer',
  templateUrl: './bulk-transfer.component.html',
  styleUrls: [
    
    '../../../../../../assets/scss/scrollableTable.scss',
    './bulk-transfer.component.scss',
  ]
})
export class BulkTransferComponent {
  localStorageData :any 
  itemStockList :any = []
  selectAll = false
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
    this.getSiteList()
    this.getProjectList()
    this.getStoreList()
    this.getmasterList()
    this.getItems()

    this.form.project = this.localStorageData.project_data.id
    this.form.site = this.localStorageData.site_data.id
  }

  storeList :any = []
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

  filterInventory() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    req.set('store', this.form.store)
    if(this.form.group) {
      req.set('material__material_type',this.form.group)
    }
    if(this.form.item) {
      req.set('material',this.form.item)
    }
    req.set('all', 'true')
    this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
      let temp = data.results
      for(let i=0;i<temp.length;i++) {
        temp[i].selected = false
      }
      this.itemStockList = temp
      
    })
  }

  toggleeall() {
    for(let i=0;i<this.itemStockList.length;i++) {
      this.itemStockList[i].selected = this.selectAll
    }
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

  form :any = {}

  onSubmit() {
    let filter = this.itemStockList.filter((item: { selected: boolean; }) => item.selected == true)

    if(filter.length == 0 ) {
      this.toastrService.error('Please select Items to Proceed!', '', {
        timeOut: 2000,
      });
    } else {
      this.createMaterialIssue(filter)
    }
  }

  formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  getTime() {
    var d = new Date();
    var n = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    return n
  }

  createMaterialIssue(data:any) {
    let req : any = {}
    req.organization = this.localStorageData.organisation_details[0].id
    req.store = this.form.store
    req.site = this.form.site
    req.project = this.form.project
    req.issue_type = "transfer"
    req.date = this.formatDate()
    req.time = this.getTime()
    req.issue_items = []

    for(let i=0;i<data.length;i++) {
      req.issue_items.push({
        organization : this.localStorageData.organisation_details[0].id,
        requested_material : data[i].item_details[0][0].id,
        quantity : data[i].req_quantity,
        notes : []
      })
    }

    this.procurementApiService.addProcurementMRIssue(req).subscribe(data => {
      this.toastrService.success('Transfer completed successfully.', '', { timeOut: 2000 });
      this.backtolist();
    });
  }

  materialGroupList :any = []
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

  MaterilFilterList :any = []
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


  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results
    });
  }

}
