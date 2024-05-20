import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
declare var window: any;
@Component({
  selector: 'app-procurement-settings',
  templateUrl: './procurement-settings.component.html',
  styleUrls: [
    './procurement-settings.component.scss',
    '../../../../assets/scss/scrollableTable.scss',
    '../../../../assets/scss/tableactionButton.scss'
  ]
})

export class ProcurementSettingsComponent implements OnInit {
  itemStockList : any = []
  settingScope = ''
  siteList :any = []
  userList : any = []

  pageSize:any=10;
  page:any=1;
  paginationValue:any;

  addOffCanvas:any
  editCanvas:any
  deleteModal:any

  canvasScope = ''
  selectedID = ''

  localStorageData :any



  ngOnInit(): void {

    this.settingScope = ''

    if(this.router.url == '/pms/settings/prcurement-settings/indent') {
      this.settingScope = 'indent'
    }

    if(this.router.url == '/pms/settings/prcurement-settings/po') {
      this.settingScope = 'po'
    }

    if(this.router.url == '/pms/settings/prcurement-settings/wo') {
      this.settingScope = 'work_order'
    }
    
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSiteList()
    this.getUserList()
    this.getInventryList()

    this.editCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('editZone')
    );
    this.addOffCanvas = new window.bootstrap.Offcanvas(
      document.getElementById('addZone')
    );
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteUser')
    );
  }

  constructor(
    private paginationservice : PaginationService,
    private datasharedservice : DataSharedService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private toastrService : ToastrService,
    private activeroute : ActivatedRoute,
    private router: Router,
    private apiservice : APIService
  ) {}


  addNew() {
    this.canvasScope = 'add'
  }

  actionByID(id:any,actionName:any) {
    this.selectedID = id
    this.canvasScope = actionName

    if(actionName == 'view' || actionName == 'update') {
      this.editCanvas.show()
    }

    if(actionName == 'delete') {
      this.deleteModal.show()
    }
  }


  refreshPage() {
    this.editCanvas.hide()
    this.addOffCanvas.hide()
    this.getInventryList()
  }


  deleteZoneModel() {
    this.deleteNow({})
  }

  deleteNow(data:any) {
    let params = new URLSearchParams();
    params.set('id', this.selectedID);
    params.set('method', 'delete');
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.procurementApiSevice.updateApprovalUser(params,data).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getInventryList()
    })
  }


  getPaginate(){
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize=this.paginationValue.pagesizeValue;
    this.page=this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)
    params.set('doctype',this.settingScope)
    this.procurementApiSevice.getProcurementApprovalUser(params).subscribe(data => {
      this.itemStockList = data.results;    
    })

  }
  
  getInventryList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    req.set('doctype',this.settingScope)
    this.procurementApiSevice.getProcurementApprovalUser(req).subscribe(data => {
      this.itemStockList = data.results;  
      this.paginationservice.setTotalItemData(data.count); 
    })
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }

  getUserName(id:any) {
    let filter = this.userList.filter((item: { id: any; }) => item.id == id)
    if(filter.length > 0) {
      return filter[0].full_name
    } else {
      return ''
    }
  }

  getSiteNames(ids:any) {
    let res = []
    for(let i=0;i<ids.length;i++) {
      let filter = this.siteList.filter((item: { id: any; }) => item.id == ids[i].id)
      if(filter.length>0) {
        res.push(filter[0].site_name)
      }
    }
    return res.toString()
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }
}
