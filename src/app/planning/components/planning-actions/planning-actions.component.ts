import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { output } from 'src/app/ckeditor5/webpack.config';

@Component({
  selector: 'app-planning-actions',
  templateUrl: './planning-actions.component.html',
  styleUrls: [
    './planning-actions.component.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class PlanningActionsComponent implements OnChanges, OnInit {
  @Input()
  selectedScope!: any;

  @Input()
  actionButtonText!: any;

  RiskApprovalMatrixData:any = []

  @Input()
  projectId!: any;
  
  @Input()
  projectData!: any;

  userData:any
  
  riskApprovalRemarks = '';
  RiskApprovalTnCAccepted = false;
  swowRiskApprovalStatus = false;
  riskApprovalOption = ''
  nextScope:any = [] // add only those where next button not required
  // approveScope:any = ['planning_risk_evaluation'] // add only those where approve required
  // rejectScope:any = ['planning_risk_evaluation'] // add only those where Reject required

  constructor(
    private apiservice: APIService,
    private commonFunction: CommonFunctionService,
    private datasharedservice: DataSharedService
  ) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    this.swowRiskApprovalStatus = false
    if(this.selectedScope == 'planning_risk_evaluation') {
      this.riskMatrixApprovalScope() 
    }

  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'))
  }

  riskMatrixApprovalScope() {
    this.RiskApprovalMatrixData = []
    let planning_head_details = this.projectData.planning_head_details[0]
    planning_head_details.role = 'Planning Head'
    planning_head_details.remarks = ''
    planning_head_details.action_status = 'Pending'
    let project_head_details = this.projectData.project_head_details[0]
    project_head_details.role = 'Project Head'
    project_head_details.remarks = ''
    project_head_details.action_status = 'Pending'

    this.RiskApprovalMatrixData.push(planning_head_details)
    this.RiskApprovalMatrixData.push(project_head_details)
    let params = this.commonFunction.getURL({
      'project_id' : this.projectId
    });
    this.apiservice.getPlanningRiskDetails(params).subscribe(data => {
      for(let i=0;i<data.results.length;i++) {
        for(let j=0;j<this.RiskApprovalMatrixData.length;j++) {
          if(data.results[i].users == this.RiskApprovalMatrixData[j].id) {
            this.RiskApprovalMatrixData[j].remarks = data.results[i].risk_remarks
            this.RiskApprovalMatrixData[j].action_status = data.results[i].options
          }
        }
        if(this.userData.user_id == data.results[i].users) {
          this.riskApprovalRemarks = data.results[i].risk_remarks
          this.riskApprovalOption =  data.results[i].options
        }
      }
    });
    this.swowRiskApprovalStatus = true
  }

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  @Output("proceedNext") proceedNext: EventEmitter<any> = new EventEmitter();

  submitPanningForm() {
    
  }

  planningSave() {
    this.parentFun.emit();
  }

  planningNext() {
    this.proceedNext.emit();
  }

  submitriskApproval() {
 
    if( this.riskApprovalOption != null && this.RiskApprovalTnCAccepted == true && this.riskApprovalRemarks != '') {
      let params = this.commonFunction.getURL({
        'project_id' : this.projectId
      });
      let req = {
        'remarks' : this.riskApprovalRemarks,
        'options':this.riskApprovalOption,

      }
      this.apiservice.editPlanningRiskDetails(params,req).subscribe(data => {
        this.planningNext()
      });

      
    }
  }

}
