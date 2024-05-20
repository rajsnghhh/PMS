import { Component } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-material-req-plan',
  templateUrl: './material-req-plan.component.html',
  styleUrls: ['./material-req-plan.component.scss',
  '../../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class MaterialReqPlanComponent {

  localStorageData: any;
  materialReqPlan:any=[];
  projectList: any = []
  itemList:any;
  itemName:any;
  form = {
    project: '',
  };


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService
  ) { }

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.form.project = this.localStorageData.project_data.id

    this.getmaterialPlan();
    this.getProjectList()
    this.viewItemList()
  }
  onSubmit(){
    this.getmaterialPlan()
  }

  viewItemList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.itemList = data.results;
    })
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');

    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results
    });
  }

  getmaterialPlan() {
    let params = new URLSearchParams();
    params.set('organization_id',this.localStorageData?.organisation_details[0]?.id);
    params.set('project',this.localStorageData.project_data.id);

    if(this.itemName){
      params.set('id',this.itemName);
    }

    this.apiservice.getMaterialPlan(params).subscribe(data=>{
      this.materialReqPlan=data.result;
    })
  }

}
