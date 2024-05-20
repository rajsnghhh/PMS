import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-delay-mis',
  templateUrl: './delay-mis.component.html',
  styleUrls: ['./delay-mis.component.scss']
})
export class DelayMisComponent implements OnChanges {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  @Input()
  projectId!: any;

  prefieldData:any={};

  delayMisData: any;
  localStorageData: any;
  bindData: any = {};
  allowToCall = true

  constructor(
    private apiservice: APIService,
    private commonFunction: CommonFunctionService,
    private datasharedservice: DataSharedService,

  ) { }

  ngOnChanges(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getTableData();
    let queryparams = new URLSearchParams();
    queryparams.set('organization_id', this.localStorageData.organisation_details[0].id);

    this.apiservice.getDelayreason(queryparams).subscribe(data => {
      this.delayMisData = data.results;
    })

    this.callFromParent();
  }

  callFromParent(){
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: this.projectId,
        form_menu_type: 'planning_risk_evaluation',
      }
    )
    this.apiservice.getProjectData(query).subscribe(data => {

     for(let item of data.project_data){
      if(item.internal_name=="length_of_the_project__in_kms_planning"){
        this.prefieldData.projectLength=item.value;
      }

      if(item.internal_name=="contract_value_in_crs_planning"){
        this.prefieldData.contractValue=item.value;
      }

      if(item.internal_name=="contract_durations__days_planning"){
        this.prefieldData.contractDurationDays=item.value;
      }
     }
    });
  }

  getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
  
    return previous;
  }

  formatDate(date:any) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }

  padTo2Digits(num:any) {
    return num.toString().padStart(2, '0');
  }

  getTableData() {
    let params = this.commonFunction.getURL({
      'project_id': this.projectId
    });

    this.apiservice.getPlanningRiskDiary(params).subscribe(data => {
       for(let prevdata of data.results){
        this.bindData['details_of_risks' + prevdata.delay_reason] = prevdata.details_of_risks;
        this.bindData['mitigation_plan' + prevdata.delay_reason] = prevdata.mitigation_plan;
        this.bindData['responsible_manager' + prevdata.delay_reason] = prevdata.responsible_manager;
        this.bindData['side' + prevdata.delay_reason] = prevdata.side;
        this.bindData['wtd_risk' + prevdata.delay_reason] = prevdata.wtd_risk;
        this.bindData['type_r' + prevdata.delay_reason] = prevdata.type_r;
        this.bindData['remarks' + prevdata.delay_reason] = prevdata.remarks;
        this.bindData['length_affected_from' + prevdata.delay_reason] = prevdata.length_affected_from;
        this.bindData['length_affected_to' + prevdata.delay_reason] = prevdata.length_affected_to;
        this.bindData['length_rm' + prevdata.delay_reason] = prevdata.length_rm;
        this.bindData['project_length_affected_in_percentage' + prevdata.delay_reason] = prevdata.project_length_affected_in_percentage;
        this.bindData['scope_affected' + prevdata.delay_reason] = prevdata.scope_affected;
        this.bindData['scope_affected_in_percentage' + prevdata.delay_reason] = prevdata.scope_affected_in_percentage;
        this.bindData['mitigation_expected_by' + prevdata.delay_reason] = prevdata.mitigation_expected_by;
        this.bindData['mitigation_from' + prevdata.delay_reason] = prevdata.mitigation_from;
        this.bindData['mitigation_to' + prevdata.delay_reason] = prevdata.mitigation_to;
        this.bindData['likely_days_affected' + prevdata.delay_reason] = prevdata.likely_days_affected;
        this.bindData['contract_durations_in_percentage' + prevdata.delay_reason] = prevdata.contract_durations_in_percentage;
        this.bindData['value_of_direct_impact_wrt_revenue_or_sales' + prevdata.delay_reason] = prevdata.value_of_direct_impact_wrt_revenue_or_sales;
        this.bindData['estimated_indirect_expenses' + prevdata.delay_reason] = prevdata.estimated_indirect_expenses;
        this.bindData['contigency' + prevdata.delay_reason] = prevdata.contigency;
        this.bindData['gross_impact' + prevdata.delay_reason] = prevdata.gross_impact;
        this.bindData['contract_price_in_percentage' + prevdata.delay_reason] = prevdata.contract_price_in_percentage;
       }
    })
  }

  changeInput(delay_reason_id: any,parameter:any) {

    if(this.bindData['length_affected_from' + delay_reason_id] && this.bindData['length_affected_to' + delay_reason_id]){
      this.bindData['length_rm' + delay_reason_id]=this.bindData['length_affected_to' + delay_reason_id] - this.bindData['length_affected_from' + delay_reason_id]
    }

    if(this.prefieldData?.projectLength && this.bindData['length_rm' + delay_reason_id]){
      this.bindData['project_length_affected_in_percentage' + delay_reason_id]=this.bindData['length_rm' + delay_reason_id]/ (this.prefieldData?.projectLength*1000)
    }

    if(this.prefieldData?.contractValue && this.bindData['scope_affected' + delay_reason_id]){
      this.bindData['scope_affected_in_percentage' + delay_reason_id]=(this.bindData['scope_affected' + delay_reason_id] / this.prefieldData?.contractValue)*100;
    }

    if(this.bindData['mitigation_expected_by' + delay_reason_id]){
      this.bindData['mitigation_to' + delay_reason_id]= this.formatDate(this.getPreviousDay(new Date(this.bindData['mitigation_expected_by' + delay_reason_id])));
    }
    if(this.bindData['mitigation_to' + delay_reason_id] && this.bindData['mitigation_from' + delay_reason_id]){
      this.bindData['likely_days_affected' + delay_reason_id]= (new Date(this.bindData['mitigation_to' + delay_reason_id]).getTime() - new Date(this.bindData['mitigation_from' + delay_reason_id]).getTime())/ (1000 * 3600 * 24);
    }

    if(this.prefieldData?.contractDurationDays && this.bindData['likely_days_affected' + delay_reason_id]){
      this.bindData['contract_durations_in_percentage' + delay_reason_id]=this.bindData['likely_days_affected' + delay_reason_id] / (this.prefieldData?.contractDurationDays);
    }

    if(this.bindData['value_of_direct_impact_wrt_revenue_or_sales' + delay_reason_id] && this.bindData['estimated_indirect_expenses' + delay_reason_id] && this.bindData['contigency' + delay_reason_id]){
      this.bindData['gross_impact' + delay_reason_id]=this.bindData['value_of_direct_impact_wrt_revenue_or_sales' + delay_reason_id] + this.bindData['estimated_indirect_expenses' + delay_reason_id] + this.bindData['contigency' + delay_reason_id];
    }

    if(this.prefieldData?.contractValue && this.bindData['gross_impact' + delay_reason_id]){
      this.bindData['contract_price_in_percentage' + delay_reason_id]=(this.bindData['gross_impact' + delay_reason_id] / this.prefieldData?.contractValue);
    }

    if(this.bindData['scope_affected_in_percentage' + delay_reason_id] && this.bindData['contract_durations_in_percentage' + delay_reason_id] && this.bindData['contract_price_in_percentage' + delay_reason_id]){
      this.bindData['wtd_risk' + delay_reason_id]=((this.bindData['scope_affected_in_percentage' + delay_reason_id] *20 )/100) + ((this.bindData['contract_durations_in_percentage' + delay_reason_id]* 30)/100) + ((this.bindData['contract_price_in_percentage' + delay_reason_id] * 50)/100);
    }
    if(this.bindData['wtd_risk' + delay_reason_id]){
       if(this.bindData['wtd_risk' + delay_reason_id]>0.05){
        this.bindData['type_r' + delay_reason_id] = 'RH'
       }else if(this.bindData['wtd_risk' + delay_reason_id] < 0.02){
        this.bindData['type_r' + delay_reason_id] = 'RL'
       }else{
        this.bindData['type_r' + delay_reason_id] = 'RM'
       }
    }

    let param = {
      'project_id':this.projectId,
      'delay_reason_id':delay_reason_id,
      'details_of_risks':this.bindData['details_of_risks' + delay_reason_id],
      'mitigation_plan':this.bindData['mitigation_plan' + delay_reason_id],
      'responsible_manager':this.bindData['responsible_manager' + delay_reason_id],
      'side':this.bindData['side' + delay_reason_id],
      'wtd_risk':this.bindData['wtd_risk' + delay_reason_id],
      'type_r':this.bindData['type_r' + delay_reason_id],
      'remarks':this.bindData['remarks' + delay_reason_id],
      'length_affected_from':this.bindData['length_affected_from' + delay_reason_id],
      'length_affected_to':this.bindData['length_affected_to' + delay_reason_id],
      'length_rm':this.bindData['length_rm' + delay_reason_id],
      'project_length_affected_in_percentage':this.bindData['project_length_affected_in_percentage' + delay_reason_id],
      'scope_affected':this.bindData['scope_affected' + delay_reason_id],
      'scope_affected_in_percentage':this.bindData['scope_affected_in_percentage' + delay_reason_id],
      'mitigation_expected_by':this.bindData['mitigation_expected_by' + delay_reason_id],
      'mitigation_from':this.bindData['mitigation_from' + delay_reason_id],
      'mitigation_to':this.bindData['mitigation_to' + delay_reason_id],
      'likely_days_affected':this.bindData['likely_days_affected' + delay_reason_id],
      'contract_durations_in_percentage':this.bindData['contract_durations_in_percentage' + delay_reason_id],
      'value_of_direct_impact_wrt_revenue_or_sales':this.bindData['value_of_direct_impact_wrt_revenue_or_sales' + delay_reason_id],
      'estimated_indirect_expenses':this.bindData['estimated_indirect_expenses' + delay_reason_id],
      'contigency':this.bindData['contigency' + delay_reason_id],
      'gross_impact':this.bindData['gross_impact' + delay_reason_id],
      'contract_price_in_percentage':this.bindData['contract_price_in_percentage' + delay_reason_id],
    }

    this.apiservice.editDelayMisTableList(param).subscribe(data => {
      this.getTableData();
    })

  }
  
  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

}
