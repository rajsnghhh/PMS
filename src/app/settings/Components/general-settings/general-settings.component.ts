import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: [
    './general-settings.component.scss',
    '../../../../assets/scss/scrollableTable.scss',
  ]
})
export class GeneralSettingsComponent {
  itemStockList : any = []

  pageSize:any=10;
  page:any=1;
  paginationValue:any;

  addOffCanvas:any
  editCanvas:any
  deleteModal:any

  canvasScope = ''
  selectedID = ''
  siteList : any = []

  localStorageData :any

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getInventryList()
    this.getSiteList()
   
  }

  constructor(
    private paginationservice : PaginationService,
    private datasharedservice : DataSharedService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private toastrService : ToastrService,
    private apiservice :APIService
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


  

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }


  editNow(data:any) {
    let req = {
      data : [
        {
          'organization' : data.organization,
          'setting_name' : data.setting_name,
          'site_ids' : data.siteList,
          'is_active' : data.is_active,
          'tag' : data.tag
        }
      ]
    }
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.procurementApiSevice.updateGeneralSetting(params,req).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
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
    this.procurementApiSevice.getProcurementGeneralSetting(params).subscribe(data => {
      this.itemStockList = data.results; 
      this.setSiteList()
    })

  }

  setSiteList() {
    for(let i=0;i<this.itemStockList.length;i++) {
      this.itemStockList[i]["siteList"] = this.getsiteArray(this.itemStockList[i].site)
    }
  }

  getsiteArray(data:any) {
    let res = []
    for(let i=0;i<data.length;i++) {
      res.push(data[i].id)
    }
    return res
  }
  
  getInventryList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.procurementApiSevice.getProcurementGeneralSetting(req).subscribe(data => {
      this.itemStockList = data.results;  
      this.setSiteList()
      this.paginationservice.setTotalItemData(data.count); 
    })
  }
}
