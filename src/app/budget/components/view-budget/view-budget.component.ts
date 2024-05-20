import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-view-budget',
  templateUrl: './view-budget.component.html',
  styleUrls: [
    './view-budget.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class ViewBudgetComponent implements OnInit, OnChanges {
  localStorageData: any
  IDCcatagoryList: any = []
  IDCmasterlist: any = []
  labourMasterlist: any = []
  materialMasterlist: any = []
  PnEmasterlist: any = []
  BOQDetailsList: any = []
  WbsList: any = []
  budgetTotla = 0
  isBoqApproverPresent: boolean = false

  @Input()
  selectedBOQ!: any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService
  ) {

  }

  ngOnInit(): void {

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getIDCmasterlist()
    this.getLabourmasterList()
    this.getMaterialmasterList()
    this.getPnEmasterList()
    this.getBOQDETAILS()
    this.getWBSData()
    this.getUserDetails()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0].user_permissions
      if (rolesArray.includes('boq-approver')) {
        this.isBoqApproverPresent = true
      }
    })
  }



  getCaagory(id: any) {
    for (let i = 0; i < this.IDCcatagoryList.length; i++) {
      if (this.IDCcatagoryList[i].id == id) {
        return this.IDCcatagoryList[i].name
      }
    }
    return ''
  }

  getIDCmasterlist() {
    let params1 = new URLSearchParams();
    params1.set('organization_id', this.localStorageData.organisation_details[0].id);
    params1.set('all', 'true');
    this.apiservice.getIndirectCostCategoryList(params1).subscribe(data => {
      this.IDCcatagoryList = data.results
      this.getChildMaster()
    })

  }

  getChildMaster() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getIndirectCostMasterList(params).subscribe(data => {
      this.IDCmasterlist = data.results
    })
  }


  getLabourmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getLabourMasterList(params).subscribe(data => {
      this.labourMasterlist = data.results
    })
  }

  getMaterialmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.materialMasterlist = data.results
    })
  }


  getPnEmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getPlantMachineryList(params).subscribe(data => {
      this.PnEmasterlist = data.results
    })
  }


  getBOQDETAILS() {
    let params = new URLSearchParams();
    params.set('id', this.selectedBOQ);
    this.apiservice.getBOQDETAILS(params).subscribe(data => {
      this.BOQDetailsList = data[0]
      this.budgetTotla = 0
      for (let i = 0; i < this.BOQDetailsList.wbs_list.length; i++) {
        this.budgetTotla += this.BOQDetailsList.wbs_list[i].cost
      }
    })

  }

  getWBSData() {
    let params = new URLSearchParams();
    params.set('boq_id', this.selectedBOQ);

    this.apiservice.getWbsList(params).subscribe(data => {
      this.WbsList = data.results;
    })
  }



}
