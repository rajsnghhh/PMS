import { Component,OnInit} from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-purchase-reject',
  templateUrl: './purchase-reject.component.html',
  styleUrls: ['./purchase-reject.component.scss',
  '../../../../../../assets/scss/scrollableTable.scss']
})
export class PurchaseRejectComponent implements OnInit{

  localStorageData: any;
  purchaseListDetails: Array<any> = [];

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;

  constructor(
    private procurementApiSevice : PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private paginationservice: PaginationService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPurchaseList();
  }

  purchaseCheckboxIds :any = []

  onPurchaseCheckboxChange(event: any, itemId: number) {
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
        "status": "rejected",
      })
    }

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('type', 'purchase');
    this.procurementApiSevice.updateProcurementSatatus(params,req).subscribe(data => {
      this.getPurchaseList();
      this.purchaseCheckboxIds=[]
    })
  }


  getPurchaseList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('status', 'pending');


    this.procurementApiSevice.getPurchaseListDetails(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.purchaseListDetails = data.results;      
    })
  }

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
    params.set('status', 'pending');

    this.procurementApiSevice.getPurchaseListDetails(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.purchaseListDetails = data.results;      
    })

  }
}

