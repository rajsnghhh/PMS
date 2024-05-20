import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-site-wise-stock',
  templateUrl: './site-wise-stock.component.html',
  styleUrls: [
    './site-wise-stock.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class SiteWiseStockComponent {
  addPersonalInformation:any = {}
  financialYearData :any = {}
  storeList :any = []
  siteList : any = []
  materialTypeList : any = []
  inventoryList :any = []

  constructor(
    private apiservice : APIService,
    private procurementApiService : PROCUREMENTAPIService,
    private datasharedservice : DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService

  ) {}

  localStorageData :any


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getFinancoialYearData()
    this.getSiteList()
    this.getMaterialType()
  }


  getFinancoialYearData() {
    this.procurementApiService.getFinanCialyrData().subscribe(data => {
      this.financialYearData = data.results;
    })
  }


  getItemList() {
    if(this.addPersonalInformation.site && this.addPersonalInformation.financial_year && this.addPersonalInformation.item_type) {
      let req = new URLSearchParams();
      req.set('organization_id', this.localStorageData.organisation_details[0].id);
      req.set('site', this.addPersonalInformation.site)
      req.set('financialyear', this.addPersonalInformation.financial_year)
      req.set('material__material_type', this.addPersonalInformation.item_type)
      
  
      this.procurementApiService.getProcurementInventoryDetails(req).subscribe(data => {
        this.inventoryList = data.results
      })
    } else {
      this.inventoryList = []
    }
  }

  changeInventory() {
    let filter = this.inventoryList.filter((item: { id: any; }) => item.id == this.addPersonalInformation.inventory)
    if(filter.length > 0) {
      this.addPersonalInformation.min_quantity = filter[0].min_stock_quantity
      this.addPersonalInformation.max_quantity = filter[0].max_stock_quantity
      this.addPersonalInformation.material = filter[0].material
      
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

  getMaterialType() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;      
    })
  }
  
  personalSubmit() {

    this.addPersonalInformation.organization = this.localStorageData.organisation_details[0].id
    
    this.procurementApiService.sitewiseStockUpdate(this.addPersonalInformation).subscribe(data => {
      // this.materialTypeList = data.results;     
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      setTimeout(function(){ location.reload(); }, 2000);
    })
  }
}
