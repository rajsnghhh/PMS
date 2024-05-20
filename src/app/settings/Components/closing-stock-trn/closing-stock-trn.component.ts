import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-closing-stock-trn',
  templateUrl: './closing-stock-trn.component.html',
  styleUrls: [
    './closing-stock-trn.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class ClosingStockTRNComponent {
  addPersonalInformation:any = {}
  financialYearData :any = {}
  storeList :any = []
  materialTypeList : any = []

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
    this.getStoreList()
    this.getMaterialType()
  }


  getFinancoialYearData() {
    this.procurementApiService.getFinanCialyrData().subscribe(data => {
      this.financialYearData = data.results;
    })
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
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
    let req:any = {
      method : this.addPersonalInformation?.method,
      store_list: this.addPersonalInformation?.store_list.toString(),
      current_financial_year : this.addPersonalInformation?.current_financial_year,      
      organization_id : this.localStorageData.organisation_details[0].id,
    }
    if(this.addPersonalInformation.store__site__location__icontains) {
      req.store__site__location__icontains = this.addPersonalInformation.store__site__location__icontains
    }
    if(this.addPersonalInformation.material__material_type__in) {
      req.material__material_type__in = this.addPersonalInformation.material__material_type__in.toString()
    }
    let query = this.commonFunction.getURL(req)
    
    this.procurementApiService.closingStockUpdate(query).subscribe(data => {
      this.materialTypeList = data.results;     
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      setTimeout(function(){ location.reload(); }, 2000);
    })
  }
}
