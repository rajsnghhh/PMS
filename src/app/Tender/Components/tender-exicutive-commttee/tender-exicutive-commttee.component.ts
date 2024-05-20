import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-tender-exicutive-commttee',
  templateUrl: './tender-exicutive-commttee.component.html',
  styleUrls: [
    './tender-exicutive-commttee.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/survey-common.scss'
  ]
})
export class TenderExicutiveCommtteeComponent implements OnInit, OnChanges {

  @Input()
  TenderNumber!: any;

  @Input()
  MenuFormList!:any

  @Input()
  selectedTab!:any
  

  @Input()
  tenderFlags!: any;
  waitingForApproval = false
  userLevel = []
  memberListError = false
  @ViewChild('f', { read: ElementRef })
  validForm!: ElementRef<HTMLElement>;
  gropuList: any = [];
  localStorageData: any;
  MultidropdownSettings = {}
  avliableMembers: any = []
  selectedGroup: any;
  Committe: any = ''
  memberList: any = []
  commtteeList: any = []
  Accepted = false
  committeeID = ''
  remarks = ''
  action_status = ''
  CommtteeSatus = ""
  is_approval_user = false
  tenderApproved = false
  tenderRejected = false
  resendApproval = false
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private commonfunction: CommonFunctionService,
    private router: Router,
    private toastrService: ToastrService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tenderFlags) {
      if (this.tenderFlags.is_approved == true) {
        this.tenderApproved = true
        this.waitingForApproval = true
      }else if(this.tenderFlags.is_sent_for_approval == true && this.tenderFlags.is_reject == true) {
        this.tenderRejected = true
        this.waitingForApproval = true
      } else if(this.tenderFlags.is_sent_for_approval == true && this.tenderFlags.is_approved == false) {
        this.waitingForApproval = true
      } else {
        this.waitingForApproval = false
      }
      this.getApprovalSatus()
    }

    if(this.MenuFormList) {
      for(let i=0;i<this.MenuFormList.length;i++) {
        if(this.MenuFormList[i].form_type_name == this.selectedTab) {
          this.CommtteeSatus = this.MenuFormList[i].form_name
        }
      }
    }
  }

  getUserDetails() {
    this.apiservice.gettenderUserDetails(this.datasharedservice.getLocalData('tender_id')).subscribe(data => {
      this.resendApproval = data.results[0].is_resend_enabled
    })
  }

  changeStatus(status: string) {
    this.action_status = status
  }

  getApprovalSatus() {
    if (this.committeeID) {
      let params = new URLSearchParams();
      params.set('ex_commitee_id', this.committeeID);
      this.apiservice.getExicutiveCommiteeApprovar(params,this.selectedTab).subscribe(data => {
        for (let i = 0; i < data.results.length; i++) {

          for (let j = 0; j < this.avliableMembers.length; j++) {

            if (data.results[i].users == this.avliableMembers[j].id) {
              this.avliableMembers[j].approved_message = data.results[i].status
              this.avliableMembers[j].approved_Remarks = data.results[i].remarks
            }
          }
        }
      })
    }
  }
  ngOnInit(): void {
    this.getSelectedCommitte();
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getGroupList();
    this.getUserDetails()
  }

  submitApproval() {
    if (this.Accepted && this.remarks != '') {
      if(this.action_status == 'resend') {
        let payload = {
          "user_id": this.localStorageData.user_id,
          "remarks": this.remarks
        }
        let params = new URLSearchParams();
        params.set('organization_id', this.localStorageData.organisation_details[0].id);
        params.set('tender_id', JSON.parse(this.datasharedservice.getLocalData('tender_id')));
        params.set('is_reverse_for_recommendation', 'true');
        this.apiservice.sendbackFromEx(payload,params).subscribe(data => {
          window.location.reload()
        },err=>{
          if(err.error.msg){
            this.toastrService.error(err.error.msg, '', {
              timeOut: 2000,
            });
          }else{
            this.toastrService.error(Error_Messages.Failed_HTTP, '', {
              timeOut: 2000,
            });
          }
        })
      } else {
        let payload = {
          "user_id": this.localStorageData.user_id,
          "remarks": this.remarks
        }
        let params = new URLSearchParams();
        params.set('ex_commitee_id', this.committeeID);
        params.set('action_status', this.action_status);
        this.apiservice.saveExicutiveCommiteeApproval(params, payload,this.selectedTab).subscribe(data => {
          window.location.reload()
        },err=>{
          if(err.error.msg){
            this.toastrService.error(err.error.msg, '', {
              timeOut: 2000,
            });
          }else{
            this.toastrService.error(Error_Messages.Failed_HTTP, '', {
              timeOut: 2000,
            });
          }
        })
      }

    }

  }

  resendForApproval() {

    let params = new URLSearchParams();
    params.set('ex_commitee_id', this.committeeID);
    this.apiservice.resendForApploval(params).subscribe(data => {
      window.location.reload()
    },err=>{
      if(err.error.msg){
        this.toastrService.error(err.error.msg, '', {
          timeOut: 2000,
        });
      }else{
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })

  }


  selectunselet() {
    let selectCount = 0
    for (let i = 0; i < this.avliableMembers.length; i++) {
      if (this.avliableMembers[i].selected) {
        selectCount++
      }
    }
    if (selectCount == 0) {
      this.memberListError = true
    } else {
      this.memberListError = false
    }
  }

  changeCommitte() {
    this.avliableMembers = []
    this.userLevel = []
    if (this.Committe != "") {
      for (let i = 0; i < this.gropuList.length; i++) {
        if (this.Committe == this.gropuList[i].id) {
          this.userLevel = this.gropuList[i].level_list
        }
      }
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('id', this.Committe)
      this.apiservice.getGroupList(params).subscribe(data => {
        let index = 0
        for (let i = 0; i < data.user_groups.length; i++) {
          data.user_groups[i].id = data.user_groups[i].user_id
          data.user_groups[i].itemName = data.user_groups[i].user__username
          if (this.memberList.includes(data.user_groups[i].user_id)) {
            data.user_groups[i].selected = true
            data.user_groups[i].userLevel = this.commtteeList[index]
            index++
          } else {
            data.user_groups[i].selected = false
            data.user_groups[i].userLevel = 1
          }
        }

        if (this.memberList.length == 0) {
          for (let i = 0; i < data.user_groups.length; i++) {
            data.user_groups[i].selected = true
          }
        }

        this.avliableMembers = data.user_groups;
        this.getApprovalSatus()
      })
    }
  }

  getSelectedCommitte() {
    let params = this.commonfunction.getURL({
      tender_id: this.TenderNumber
    })
    this.apiservice.getExicutiveCommitee(params,this.selectedTab).subscribe(data => {
      if(data.results.length > 0){
        this.committeeID = data.results[0].id
        this.is_approval_user = data.results[0].is_approval_user
        this.Committe = data.results[0].groups
        this.memberList = []
        this.commtteeList = []
        for (let i = 0; i < data.results[0].tender_users.length; i++) {
          this.memberList.push(data.results[0].tender_users[i].users)
          this.commtteeList.push(data.results[0].tender_users[i].commitee_level)
        }
      }
      this.getGroupList()
    })
  }

  dropDownSettings() {
    this.MultidropdownSettings = {
      singleSelection: false,
      disabled: false,
      text: "",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    }
  }



  getGroupList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getGroupList(params).subscribe(data => {
      this.gropuList = data.results;
      this.changeCommitte()
    })
  }


  submitTenderData() {
    if (this.TenderNumber != '' && this.memberListError != true) {
      let params = this.commonfunction.getURL({
        tender_id: this.TenderNumber
      })
      let MemberList = []
      let commitee_level = []
      let level = []
      for (let i = 0; i < this.avliableMembers.length; i++) {
        if (this.avliableMembers[i].selected) {
          MemberList.push(this.avliableMembers[i].id)
          commitee_level.push(parseInt(this.avliableMembers[i].userLevel))
          level.push('Level ' + this.avliableMembers[i].userLevel)
        }

      }

      let request: any = {
        "group_id": parseInt(this.Committe),
        "user_ids": []
      }
      for (let i = 0; i < MemberList.length; i++) {
        request.user_ids.push({
          "user_id": MemberList[i],
          "level": level[i],
          "commitee_level": commitee_level[i]
        })
      }

      this.apiservice.saveExicutiveCommitee(params, request,this.selectedTab).subscribe(data => {
        // this.router.navigate(['/pms/tender/evaluations-summary'])
        window.location.reload()
      })
    }
  }
}
