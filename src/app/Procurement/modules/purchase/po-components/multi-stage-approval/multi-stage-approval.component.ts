import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-multi-stage-approval',
  templateUrl: './multi-stage-approval.component.html',
  styleUrls: [
    './multi-stage-approval.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
  ]
})
export class MultiStageApprovalComponent implements OnInit {

  procurementIndentRequest : any = []
  localStorageData : any

  userList :any =[]
  constructor(
    private datasharedservice : DataSharedService,
    private apiservice : APIService,
    private activeroute : ActivatedRoute,
    private router : Router,
    private procurementApiService : PROCUREMENTAPIService,
    private toastrService : ToastrService
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getUserList()
    this.getList()
  }

  checkedIds:any = []
  onCheckboxChange(event: any, itemId: number) {
    if (event.target.checked) {
      this.checkedIds.push(itemId);
    } else {
      const index = this.checkedIds.indexOf(itemId);
      if (index !== -1) {
        this.checkedIds.splice(index, 1);
      }
    }

  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }


  getCurrentStageStatus(current_stage:any,multi_stage_details:any,stages:any) {

  }

  getUserName(id:any) {
    let filter = this.userList.filter((item: { id: any; }) => item.id == id)
    if(filter.length > 0) {
      return filter[0].full_name
    } else {
      return ''
    }
  }

  getStatus(index:any, stageData:any) {
    let filter = stageData.filter((item: { stage: any; }) => item.stage == index)
    if(filter.length > 0) {
      return filter[0].status
    }
    return 'Pending'
  }

  getRemarks(index:any, stageData:any) {
    let filter = stageData.filter((item: { stage: any; }) => item.stage == index)
    if(filter.length > 0) {
      return filter[0].remarks
    }
    return ''
  }

  checkIFstageUpdateAccess(current_stage:any,stageData:any) {
    current_stage = parseInt(current_stage) + 1
    let filter = stageData.filter((item: { procurement_multi_stage_setting_stages__stage: any; }) => item.procurement_multi_stage_setting_stages__stage == current_stage)
    if(filter[0]?.procurement_multi_stage_setting_stages__employee == this.localStorageData.user_id) {
      return true
    } else {
      return false
    }
  }

  

  backtolist() {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase-order')
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }


  updateStage () {

    let filter =  this.procurementIndentRequest.filter((item: { stage_updated: any; }) => item.stage_updated)

    let body = []

    for(let i=0;i<filter.length;i++) {
      let stage = parseInt(filter[i].current_stage)+1
      body.push({
        "id": filter[i].id,
        "current_stage": stage,
        "site": filter[i].site,
        "organization": this.localStorageData.organisation_details[0].id,
        "stage_id": null,
        "stage_stage": stage,
        "stage_status": filter[i].stage_status,
        "stage_remarks": filter[i].stage_remarks
      })
    }


    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('type', 'po');
    this.procurementApiService.updateModuleMultistage(params,body).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    });

  }

  getList() {
    let params = new URLSearchParams();

    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiService.getQuotationList(params).subscribe(data => {
      this.procurementIndentRequest = data.results
    });
  }
}
