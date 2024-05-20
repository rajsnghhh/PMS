import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-idc',
  templateUrl: './idc.component.html',
  styleUrls: ['./idc.component.scss']
})
export class IdcComponent implements OnInit, OnChanges {
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
  catagoryList:any = []
  localStorageData:any

  componentList:any = []

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService
  ) {

  }

  ngOnInit(): void {
    this.getmasterList()
    // this.getIDC()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getIDC()
  }

  getCaagory(id:any) {
    for(let i=0;i<this.catagoryList.length;i++) {
      if(this.catagoryList[i].id == id) {
        return this.catagoryList[i].name
      }
    }
    return ''
  }

  getmasterList() {
    let params1 = new URLSearchParams();
    params1.set('organization_id', this.localStorageData.organisation_details[0].id);
    params1.set('all', 'true');
    this.apiservice.getIndirectCostCategoryList(params1).subscribe(data => {
      this.catagoryList = data.results
      this.getChildMaster()
    })
    
  }

  getChildMaster() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getIndirectCostMasterList(params).subscribe(data => {
      this.masterlist = data.results
    })
  }

  getIDC() {
    this.componentList = []
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('wbs_list', this.wbsLinkedData.id);
    params.set('all', 'true');
    this.apiservice.getBOQWbsIDC(params).subscribe(data => {
      for(let i=0;i<data.results.length;i++) {
        let nodeDetails:any = {
          "id": data.results[i].id,
          "organization": this.localStorageData.organisation_details[0].id,
          "wbs_list": data.results[i].wbs_list,
          "indirect_cost": data.results[i].indirect_cost,
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
      "indirect_cost": "",
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
      this.apiservice.addBOQWbsIDC(params,addList).subscribe(data => {
        this.getIDC()
      })
    }

    if(editlist.length > 0) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'edit');
      this.apiservice.editBOQWbsIDC(params,editlist).subscribe(data => {
        this.getIDC()
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
      this.apiservice.editBOQWbsIDC(params,req).subscribe(data => {
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
