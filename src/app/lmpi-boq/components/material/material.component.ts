import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit, OnChanges {
  @Input()
  wbsID!: any;
  @Input()
  keyScopeID!: any;
  @Input()
  tenderID!: any;
  @Input()
  wbsLinkedData!: any;

  @Input()
  DisableModify!: any;

  @Input()
  selectedTab!: any;
  
  masterlist:any = []
  localStorageData:any

  componentList:any = []

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService
  ) {

  }

  ngOnInit(): void {
    this.getmasterList()
    // this.getMaterialList()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getMaterialList()
  }


  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.masterlist = data.results
    })
  }

  getMaterialList() {
    this.componentList = []
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('wbs_list', this.wbsLinkedData.id);
    params.set('all', 'true');
    this.apiservice.getBOQWbsMaterial(params).subscribe(data => {
      for(let i=0;i<data.results.length;i++) {
        let nodeDetails:any = {
          "id": data.results[i].id,
          "organization": this.localStorageData.organisation_details[0].id,
          "wbs_list": data.results[i].wbs_list,
          "material": data.results[i].material,
          "budgeted_quantity": data.results[i].budgeted_quantity
        }
        nodeDetails.rate = data.results[i].rate
        nodeDetails.cost = data.results[i].cost
        this.componentList.push(nodeDetails)
      }
    })
  }

  addNew() {
    let nodeDetails:any = {
      "organization": this.localStorageData.organisation_details[0].id,
      "wbs_list": this.wbsLinkedData.id,
      "material": "",
      "budgeted_quantity": 0
    }
    nodeDetails.rate = 0
    this.componentList.push(nodeDetails)
  }

  save() {
    let editlist = []
    let addList = []

    for(let i=0;i<this.componentList.length;i++) {
      if(this.componentList[i].id) {
        editlist.push(this.componentList[i])
      } else {
        addList.push(this.componentList[i])
      }
    }

    if(addList.length > 0) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.apiservice.addBOQWbsMaterial(params,addList).subscribe(data => {
        this.getMaterialList()
      })
    }

    if(editlist.length > 0) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'edit');
      this.apiservice.editBOQWbsMaterial(params,editlist).subscribe(data => {
        this.getMaterialList()
      })
    }
  }

  delete(index:any) {
    if(this.componentList[index].id) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'delete');
      params.set('id', this.componentList[index].id);
      let req = [{
        "id": this.componentList[index].id
      }]
      this.apiservice.editBOQWbsMaterial(params,req).subscribe(data => {
        this.deletefromIndex(index)
      })
    } else {
      this.deletefromIndex(index)
    }
  }

  deletefromIndex(index:any) {
    let res = []
    for(let i=0;i<this.componentList.length;i++) {
      if(i != index) {
        res.push(this.componentList[i])
      }
    }
    this.componentList = res
  }

}
