import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import * as Global from 'src/app/global'
@Component({
  selector: 'app-way-bill-list',
  templateUrl: './way-bill-list.component.html',
  styleUrls: ['./way-bill-list.component.scss',
  '../../../../../../assets/scss/micro-view-table.scss',
  '../../../../../../assets/scss/scrollableTable.scss',
  '../../../../../../assets/scss/tableactionButton.scss']
})
export class WayBillListComponent {
  Global = Global;
  localStorageData: any;
  purchaseOrderList: Array<any> = [];
  isPO_Approver:boolean=false;
  isPO_Checker:boolean=false;
  @Input() purchaseOrderAdvancedSearchFormValue: any;

  @Output() activeScope = new EventEmitter<any>();

  constructor(
    private procurementAPIService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    public router: Router,
    private activeroute: ActivatedRoute,
    private commonfunction: CommonFunctionService,
    private apiservice:APIService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPurchaseOrderList();
    this.getUserDetails();
  }

  ngOnChanges() {
    if (this.purchaseOrderAdvancedSearchFormValue) {
      this.getPurchaseOrderList()
    }
  }

  scopeChange(scope:any){
    this.activeScope.emit(scope);
  }

  editWayBill(way_bill_id:any){
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/way-bill/edit/'+ way_bill_id])
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

  getPurchaseOrderList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    if (!this.purchaseOrderAdvancedSearchFormValue) {
      params.set('all', 'true');
    }

    if (this.purchaseOrderAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.purchaseOrderAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.procurementAPIService.getWayBill(params).subscribe(data => {      
      this.purchaseOrderList = data.results;
      
      if (this.purchaseOrderList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
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
