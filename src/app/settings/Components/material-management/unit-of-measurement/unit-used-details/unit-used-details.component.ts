import { Component } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-unit-used-details',
  templateUrl: './unit-used-details.component.html',
  styleUrls: ['./unit-used-details.component.scss',
  '../../../../../../assets/scss/from-coomon.scss',
  '../../../../../../assets/scss/scrollableTable.scss'
]
})
export class UnitUsedDetailsComponent {

  addUser: any = {
    unitfrom: '',
  }
  localStorageData:any;
  uomList:any;
  usedDetails:any=[];
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private paginationservice: PaginationService
  ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewUnitofMeasurement();
  }

  viewUnitofMeasurement() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }
  
  onSearch(){
    let params = new URLSearchParams();
    params.set('type','uom');
    params.set('id',this.addUser.unitfrom);
    this.apiservice.getUseDetails(params).subscribe(data=>{
      this.paginationservice.setTotalItemData(data.count);
      this.usedDetails=data.results;
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
    params.set('type','uom');
    params.set('id',this.addUser.unitfrom);

   this.apiservice.getUseDetails(params).subscribe(data=>{
      this.usedDetails=data.results;
    })
  }

}
