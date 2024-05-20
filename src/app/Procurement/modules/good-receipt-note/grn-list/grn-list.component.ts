import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-grn-list',
  templateUrl: './grn-list.component.html',
  styleUrls: ['./grn-list.component.scss',
    '../../../../../assets/scss/micro-view-table.scss',
    '../../../../../assets/scss/scrollableTable.scss',
    '../../../../../assets/scss/tableactionButton.scss']
})
export class GrnListComponent {
  localStorageData: any;
  grnList: any = []
  grnListView:boolean=true;

  @Input() purchaseOrderAdvancedSearchFormValue: any;


  constructor(
    private procurementAPIService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    public router: Router,
    private activeroute: ActivatedRoute,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getGRNList();

    
    if(this.router.url=='/pms/purchase/procurement/grn/through'){
      this.grnListView = false;
    }
  }

  ngOnChanges() {
    if (this.purchaseOrderAdvancedSearchFormValue) {
      this.getGRNList()
    }
  }

  getGRNList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id)
    params.set('site', this.localStorageData.site_data.id);

    if (this.purchaseOrderAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.purchaseOrderAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.procurementAPIService.getGRNList(params).subscribe(data => {
      this.grnList = data.results;      
      this.paginationservice.setTotalItemData(data.count);
      if (this.grnList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)
    params.set('site', this.localStorageData.site_data.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id)
    if (this.purchaseOrderAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.purchaseOrderAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.procurementAPIService.getGRNList(params).subscribe(data => {
      this.grnList = data.results;
      if (this.grnList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }
  // ViewquotationByID(id:any) {
  //   this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/quotation/compare/' + id)
  // }

  // viewByID(id: any) {
  //   this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/view/' + id)
  // }

  // printByID(id: any) {
  //   this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/print/' + id)
  // }

  // updateByID(id: any) {
  //   this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent/request/modify/' + id)
  // }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  } 

  addDebitNoteByID(id: any) {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/debit-note/add/' + id)
  }

  printByID(id: any) {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/grn/print/' + id)
  }

  viewByID(id: any) {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/grn/view/' + id)
  }

  purchase(id: any) {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase/add-grn/' + id)
  }

  purchasegst(id: any) {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase/add-gst-grn/' + id)
  }

  purchasereturn(id: any) {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase-return/add-grn/' + id)
  }

  purchasegstreturn(id: any) {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase-return/add-gst-grn/' + id)
  }

  updateByID(id: any) {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/grn/modify/' + id)
  }

}

