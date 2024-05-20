import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-plant-prod-list',
  templateUrl: './plant-prod-list.component.html',
  styleUrls: ['./plant-prod-list.component.scss',
  '../../../../../../assets/scss/micro-view-table.scss',
  '../../../../../../assets/scss/scrollableTable.scss',
  '../../../../../../assets/scss/tableactionButton.scss'
  ]
})
export class PlantProdListComponent {

  localStorageData: any;
  environment = environment;
  procurementPlantProd: Array<any> = []

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    public router: Router,
    private toastrService: ToastrService,
    private activeroute: ActivatedRoute,
    private commonfunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private procurementApiService: PROCUREMENTAPIService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getPlantProd();
  }

  getPlantProd() {
    let params = new URLSearchParams();
    params.set('all', 'true');
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('site', this.localStorageData.site_data.id);
    params.set('project', this.localStorageData.project_data.id);

    // if (this.mrAdvancedSearchFormValue) {
    //   for (const [key, value] of Object.entries(this.mrAdvancedSearchFormValue)) {
    //     let val = '' + value
    //     let ky = '' + key
    //     params.set(ky, val)
    //   }
    // }


    this.procurementApiService.getPlantProduction(params).subscribe(data => {
      this.procurementPlantProd = data.results;
      this.paginationservice.setTotalItemData(data.count); 
      if (this.procurementPlantProd.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
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
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    // if (this.mrAdvancedSearchFormValue) {
    //   for (const [key, value] of Object.entries(this.mrAdvancedSearchFormValue)) {
    //     let val = '' + value
    //     let ky = '' + key
    //     params.set(ky, val)
    //   }
    // }

    this.procurementApiService.getPlantProduction(params).subscribe(data => {
      this.procurementPlantProd = data.results.Data;
      
      if (this.procurementPlantProd.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
    
  }

  updateByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/plant-prod/modify/' + id)
  }

  viewByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/plant-prod/view/' + id)
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
