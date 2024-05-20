import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';

@Component({
  selector: 'app-plant-prod-advanced-search',
  templateUrl: './plant-prod-advanced-search.component.html',
  styleUrls: ['./plant-prod-advanced-search.component.scss',
  '../../../../../../assets/scss/micro-view-table.scss',
  '../../../../../../assets/scss/scrollableTable.scss']
})
export class PlantProdAdvancedSearchComponent {

  plantAndProdList: any;

  constructor(private procurementApiService: PROCUREMENTAPIService, private router: Router,
    private activeroute : ActivatedRoute){
  }

  ngOnInit(){
    this.getPlantAndProdList();

  }

  getPlantAndProdList() {
    let params = new URLSearchParams();
    params.set('all', 'true');
    this.procurementApiService.getPlantProduction(params).subscribe(data => {
      this.plantAndProdList = data.results;
    })
  }

  addNew(){
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/plant-prod/create')
  }

  RouteToRoll(route: any) {
    if(route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

}
