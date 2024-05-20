import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-boq-approval',
  templateUrl: './boq-approval.component.html',
  styleUrls: [
    './boq-approval.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/survey-common.scss'
  ]
})
export class BoqApprovalComponent implements OnInit {
  @Input()
  TenderNumber!: any;
  @Input()
  DisableModify!: any;
  @Input()
  usingIn!: any;
  @Input()
  scope!: any;
  @Input()
  projectId!: any;
  @Input()
  selectedScope!: any;

  Accepted: any
  remarks: any = ''
  is_approval_user = false
  resendApproval = false
  waitingForApproval = false
  memberListError = false
  Committe = ''
  gropuList: any = []
  avliableMembers: any = []
  userLevel: any = []
  boqApproverList : any = []
  localStorageData: any
  boqVersionStatus = ''
  serlectedBoqData: any = {}
  CommtteeSatus = 'Pending'
  approvedRejectedUserList:any = []

  constructor(
    private route: ActivatedRoute,
    private datasharedservice: DataSharedService,
    private apiservice: APIService
  ) { }

  ngOnInit(): void {
    this.approvedRejectedUserList = []
    this.waitingForApproval = false
    this.resendApproval = false
    this.is_approval_user = false
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getlatestBOQ()
    this.getUserList()
  }

  approverStatus = ''

  changeStatus(satatus: any) {
    this.approverStatus = satatus
  }

  submitData() {
    let req:any = {}
    req.name = this.serlectedBoqData.name
    req.organization = this.serlectedBoqData.organization
    req.project = this.serlectedBoqData.project
    req.approver = this.Committe
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'edit');
    params.set('id', this.serlectedBoqData.id);
    this.apiservice.editBOQ(params,req).subscribe(data => {
      this.ngOnInit()
    })
  }

  resendForApproval() { }

  submitApproval() {
    let req:any = {}
    req.name = this.serlectedBoqData.name
    req.organization = this.serlectedBoqData.organization
    req.project = this.serlectedBoqData.project
    if(this.approverStatus == 'rejected') {
      req.status = 'rejected'
    }
    if(this.approverStatus == 'approved') {
      req.status = 'approved'
    }
    req.approval_details =  [{
      status : this.approverStatus,
      description : this.remarks
    }]
    
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'edit');
    params.set('id', this.serlectedBoqData.id);
    this.apiservice.editBOQ(params,req).subscribe(data => {
      this.ngOnInit()
    })
  }

  changeCommitte() { }

  selectunselet() { }

  getlatestBOQ() {
    let projectid: any = this.route.snapshot.paramMap.get('projectid')
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    params.set('latest', 'true');
    params.set('project', projectid)

    this.apiservice.getBOQList(params).subscribe(data => {
      if (data.results.id) {
        this.serlectedBoqData = data.results
        this.boqVersionStatus = 'edit'
        this.Committe = data.results.approver
        if(data.results.approver.length > 0 ) {
          this.resendApproval = true
          if(data.results.approver.includes(this.localStorageData.user_id)) {
            this.is_approval_user = true
          }
        } else {
          this.waitingForApproval = true
        }

        for(let i=0;i<data.results.approval_details.length;i++) {
          this.approvedRejectedUserList.push(data.results.approval_details[i].created_by)
        }
      } else {
        this.boqVersionStatus = 'blank'
      }
    });
  }
  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('permissions', 'boq-approver');
    this.apiservice.getFilterUserList(params).subscribe(data => {
      this.boqApproverList = data
    })
  }

  getUserName(id:any) {
    for(let i=0;i<this.boqApproverList.length;i++) {
      if(this.boqApproverList[i].user_id == id) {
        return this.boqApproverList[i].full_name
      }
    }
    return ''
  }
  
}
