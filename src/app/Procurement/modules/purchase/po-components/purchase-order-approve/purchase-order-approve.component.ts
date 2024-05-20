import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-purchase-order-approve',
  templateUrl: './purchase-order-approve.component.html',
  styleUrls: ['./purchase-order-approve.component.scss',
  '../../../../../../assets/scss/micro-view-table.scss',
  '../../../../../../assets/scss/scrollableTable.scss',
  '../../../../../../assets/scss/tableactionButton.scss']
})
export class PurchaseOrderApproveComponent {

  
  localStorageData: any;
  purchaseOrderList: Array<any> = []

  @Input() purchaseOrderAdvancedSearchFormValue: any;
  @Output() activeScope = new EventEmitter<any>();


  constructor(
    private procurementAPIService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    public router: Router,
    private activeroute: ActivatedRoute,
    private commonfunction: CommonFunctionService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPurchaseOrderList();
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

  purchaseCheckboxIds :any = []

  onPurchaseOrderCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.purchaseCheckboxIds.push(itemId);
    } else {
      const index = this.purchaseCheckboxIds.indexOf(itemId);
      if (index !== -1) {
        this.purchaseCheckboxIds.splice(index, 1);
      }
    }

  }

  approveSubmit(){

    let req = []
    for(let i=0;i<this.purchaseCheckboxIds.length;i++) {
      req.push({
        "id": this.purchaseCheckboxIds[i],
        "status": "approved",
        "approved_remarks":this.purchaseOrderList.find((data:any)=>data.id==this.purchaseCheckboxIds[i]).approved_remarks
      })
    }

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('type', 'po');
    this.procurementAPIService.updateProcurementSatatus(params,req).subscribe(data => {
      this.activeScope.emit('list');
    })
  }



  getPurchaseOrderList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('status', 'checked');
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
    this.procurementAPIService.getQuotationList(params).subscribe(data => {      
      this.purchaseOrderList = data.results;
      
      if (this.purchaseOrderList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }
  
}
