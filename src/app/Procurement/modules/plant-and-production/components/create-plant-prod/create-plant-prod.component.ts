import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CreatePlantProdTableComponent } from '../create-plant-prod-table/create-plant-prod-table.component';
import { PlantProdTopCardComponent } from '../plant-prod-top-card/plant-prod-top-card.component';
import { ToastrService } from 'ngx-toastr';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'app-create-plant-prod',
  templateUrl: './create-plant-prod.component.html',
  styleUrls: ['./create-plant-prod.component.scss',
  '../../../../../../assets/scss/micro-view-table.scss',
  '../../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class CreatePlantProdComponent {
  localStorageData: any
  prefieldData: any = {};
  createData: any = {};
  scope = '';
  projectData:any = {}
  private isPlantProdProcurementCalled = false;

  @ViewChild(PlantProdTopCardComponent) PlantProdTopCardComponent: any;
  @ViewChild(CreatePlantProdTableComponent) CreatePlantProdTableComponent: any;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementApiService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService
  ){}

  ngOnInit(){
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.router.url.indexOf('/procurement/plant-prod/modify') > -1) {
      this.scope = 'update'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/plant-prod/view') > -1) {
      this.scope = 'view'
      this.getPrefieldData()
    } else {
      this.scope = 'add'
    }
  }


  createPlantProd() {
      this.PlantProdTopCardComponent.save()
      this.CreatePlantProdTableComponent.save();
  }

  getPrefieldData() {
    let params = new URLSearchParams();
    let procurementID = JSON.parse(this.activeroute.snapshot.paramMap.get('id') || '{}')
    params.set('all', 'true');
    params.set('id', procurementID);
    this.procurementApiService.getPlantProduction(params).subscribe(data => {
      this.prefieldData = data;
      this.getProjectData(this.prefieldData.project)
    });
  }

  getProjectData(projectId:any) {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: projectId,
      }
    )
    this.apiservice.getProjectData(query).subscribe(data => {
      this.projectData = data.project_data
    })
  }

  updatePlantProd() {
    this.PlantProdTopCardComponent.save();
    this.CreatePlantProdTableComponent.save()
  }

  appendData(req: any) {
    req = JSON.parse(req)
    this.createData = { ...this.createData, ...req };
    if (
      this.createData.plant_prod_table &&
      this.createData.plant_prod_TopValid &&
      !this.isPlantProdProcurementCalled
    ) {
      this.createData.organization = this.localStorageData.organisation_details[0].id;
      this.isPlantProdProcurementCalled = true;
      this.addProcurement();
    }

  }

  addProcurement() {
    if (this.scope == 'add'){
      this.createData.financialyear = this.localStorageData.financial_year[0].id;
      this.procurementApiService.createPlantProduction(this.createData).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.backtolist()
      },
      (error) => {
        this.isPlantProdProcurementCalled = false;
      });
    }

    if (this.scope == 'update') {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'edit');
      params.set('id', this.prefieldData.id);

      this.procurementApiService.updateProcurementPlantProduction(params, this.createData).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.backtolist()
      },
        (error) => {
          this.isPlantProdProcurementCalled = false;
        });
    }
  }

  backtolist() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/plant-prod')
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
