import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-purchase-approval',
  templateUrl: './purchase-approval.component.html',
  styleUrls: ['./purchase-approval.component.scss',
  '../../../../../../assets/scss/scrollableTable.scss']
})
export class PurchaseApprovalComponent implements OnInit{

  localStorageData: any;
  purchaseListDetails: Array<any> = [];
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;

  constructor(
    private apiservice: APIService,
    private procurementApiSevice : PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private fb: FormBuilder,
    private activeroute: ActivatedRoute,
    private router: Router
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
        "status": "approved",
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
    params.set('status', 'checked');

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
    params.set('status', 'checked');

    this.procurementApiSevice.getPurchaseListDetails(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.purchaseListDetails = data.results;      
    })

  }
}
