import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
declare var window: any;
@Component({
  selector: 'app-rate-contract',
  templateUrl: './rate-contract.component.html',
  styleUrls: [
    './rate-contract.component.scss',
    '../../../../assets/scss/scrollableTable.scss',
    '../../../../assets/scss/tableactionButton.scss'
  ]
})
export class RateContractComponent {
  itemStockList : any = []

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
  }

  constructor(
    private paginationservice : PaginationService,
    private datasharedservice : DataSharedService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private toastrService : ToastrService
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
    this.procurementApiSevice.updateRate(params,data).subscribe(data => {
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
    this.procurementApiSevice.getProcurementRateDetails(params).subscribe(data => {
      this.itemStockList = data.results;    
    })

  }
  
  getInventryList() {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.procurementApiSevice.getProcurementRateDetails(req).subscribe(data => {
      this.itemStockList = data.results;  
      this.paginationservice.setTotalItemData(data.count); 
    })
  }
}
