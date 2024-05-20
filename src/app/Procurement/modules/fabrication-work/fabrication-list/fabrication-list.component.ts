import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-fabrication-list',
  templateUrl: './fabrication-list.component.html',
  styleUrls: ['./fabrication-list.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class FabricationListComponent  implements OnInit{

  localStorageData:any;
  fabricationList:any;
  itemList:any;
  siteList:any;

  form: any = {
    voucher_no: '',
    date__gte: '',
    date__lte: '',
    number_of_jobs: '',
    site: '',
    procurement_item_stock_jv_item__item__in:''
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getData();
    this.viewItemList();
    this.getSiteList();
    this.form.site=this.localStorageData.site_data.id
  }

  onSearch(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('voucher_no', this.form.voucher_no);
    params.set('date__gte', this.form.date__gte);
    params.set('date__lte', this.form.date__lte);
    params.set('number_of_jobs', this.form.number_of_jobs);
    params.set('site', this.form.site);
    params.set('procurement_fabrication_work_raw_materials__material__in', this.form.procurement_item_stock_jv_item__item__in.toString());


    this.procurementAPIService.getFabricationWork(params).subscribe(data=>{
      this.fabricationList=data.results;
      this.fabricationList.forEach((_covenants:any) => {
        _covenants.isExpanded = false;
      });
    })
  }

  viewItemList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.itemList = data.results;
    })
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }

 getData(){
   let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    this.procurementAPIService.getFabricationWork(params).subscribe(data=>{
      this.fabricationList=data.results;
      this.fabricationList.forEach((_covenants:any) => {
        _covenants.isExpanded = false;
      });
    })
 }

 underTableClick(index:any){
  for(let i=0;i<this.fabricationList.length;i++){
   this.fabricationList[i].isExpanded=false;
     if(i==index){
       this.fabricationList[index].isExpanded=true;
     }
  }
}

}
