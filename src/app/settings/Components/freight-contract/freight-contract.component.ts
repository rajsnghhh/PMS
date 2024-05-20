import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
declare var window: any;
@Component({
  selector: 'app-freight-contract',
  templateUrl: './freight-contract.component.html',
  styleUrls: [
    './freight-contract.component.scss',
    '../../../../assets/scss/scrollableTable.scss',
    '../../../../assets/scss/tableactionButton.scss'
  ]
})

export class FreightContractComponent {
  itemStockList : any = []

  pageSize:any=10;
  page:any=1;
  paginationValue:any;

  addOffCanvas:any
  editCanvas:any
  deleteModal:any

  canvasScope = ''
  selectedID = ''

  cityList : any = []
  accountList : any = []

  localStorageData :any

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
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
    this.getCity()
    this.getAccountHeadList()
  }

  constructor(
    private paginationservice : PaginationService,
    private datasharedservice : DataSharedService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private toastrService : ToastrService,
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
    this.procurementApiSevice.updateFreight(params,data).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getInventryList()
    })
  }


  getAccountHeadList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getAccountHeads(params).subscribe(data => {
      this.accountList = data.results
    })
  }

  getCity(){
    let params = new URLSearchParams();
    params.set('country_id','102')
    this.apiservice.getCityList(params).subscribe(data => {
      this.cityList = data;
    })
  }

  getCityName(id:any) {
    let filter = this.cityList.filter((item: { city_id: any; }) => item.city_id == id)
    if (filter.length> 0) {
      return filter[0].name
    } else {
      return ''
    }
  }

  getAccountName(id:any) {
    let filter = this.accountList.filter((item: { id: any; }) => item.id == id)
    if (filter.length> 0) {
      return filter[0].name
    } else {
      return ''
    }
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
    this.procurementApiSevice.getProcurementFreightDetails(params).subscribe(data => {
      this.itemStockList = data.results;    
    })

  }
  
  getInventryList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.procurementApiSevice.getProcurementFreightDetails(req).subscribe(data => {
      this.itemStockList = data.results;  
      this.paginationservice.setTotalItemData(data.count); 
    })
  }
}
