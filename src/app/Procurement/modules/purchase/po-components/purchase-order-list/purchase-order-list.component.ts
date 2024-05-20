import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss']
})
export class PurchaseOrderListComponent {
  localStorageData: any;
  purchaseOrderList: Array<any> = [];
  isPO_Approver:boolean=false;
  isPO_Checker:boolean=false;
  productactiveScope:any = ''

  @Input() purchaseOrderAdvancedSearchFormValue: any;

  @Output() activeScope = new EventEmitter<any>();

  constructor(
    private procurementAPIService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    public router: Router,
    private activeroute: ActivatedRoute,
    private commonfunction: CommonFunctionService,
    private apiservice:APIService,
    private paginationservice :PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPurchaseOrderList();
    this.getUserDetails();
    this.productactiveScope = this.activeroute.snapshot.paramMap.get('procurementScope')
  }

  ngOnChanges() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    if (this.purchaseOrderAdvancedSearchFormValue) {
      this.getPurchaseOrderList()
    }
  }

  scopeChange(scope:any){
    this.activeScope.emit(scope);
  }

  createGRN(poID:any){
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/grn/create/po/'+ poID])
  }

  amendPO(poID:any,taxType:any){
    if(taxType == 'gst') {
      this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/amend-gst/'+ poID])
    } else {
      this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/amend/'+ poID])
    }
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions

      if (rolesArray.includes('procurement-po-approver')) {
        this.isPO_Approver = true;
      }
      if (rolesArray.includes('procurement-po-checker')) {
        this.isPO_Checker = true;
      }
    })
  }

  pageSize:any=10;
  page:any=1;
  paginationValue:any;

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
    params.set('financialyear',this.localStorageData.financial_year[0].id)
    params.set('latest','true')
    this.procurementAPIService.getQuotationList(params).subscribe(data => {
      this.purchaseOrderList = data.results;    
    })

  }

  getPurchaseOrderList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('financialyear',this.localStorageData.financial_year[0].id)
    params.set('latest','true')

    if (this.purchaseOrderAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.purchaseOrderAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.procurementAPIService.getQuotationList(params).subscribe(data => {      
      this.purchaseOrderList = data.results;
      this.paginationservice.setTotalItemData(data.count); 
      if (this.purchaseOrderList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }

  viewByID(id: any,taxType:any) {
    if(taxType == 'gst') {
      this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/view/gst/' + id)
    } else {
      this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/view/' + id)
    }
  }

  // printByID(id: any) {
  //   this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/print/' + id)
  // }

  updateByID(id: any,taxType:any) {
    if(taxType == 'gst') {
      this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/update/gst/' + id)
    } else {
      this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/update/' + id)
    }
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }


  printByID(id: any) {
    this.commonfunction.openOnNewTab('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/print/' + id)
  }

}
