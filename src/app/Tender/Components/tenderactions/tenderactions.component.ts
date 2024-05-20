import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

declare var window: any;

@Component({
  selector: 'app-tenderactions',
  templateUrl: './tenderactions.component.html',
  styleUrls: ['./tenderactions.component.scss',
  '../../../../assets/scss/from-coomon.scss'
]
})
export class TenderactionsComponent implements OnInit,OnChanges {

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  @Output("validCheckforSurvey") validCheckforSurvey: EventEmitter<any>=new EventEmitter();

  @Input()
  tenderAction!: any[];

  userDetails:any=[];
  actionData:any;
  submitAndAddMore = false;
  deleteModal: any;
  addOther: any;
  otherApiUrl:any;
  empName:any;
  localStorageData:any;
  sentForApproval = true;
  acceptTnC = true;

  @Input()
  prefieldData!: any;
  ActiveMenu:any;

  @Output("parentCompFun")
  parentCompFun: EventEmitter<any> = new EventEmitter();

  @Output("submitAndContinue")
  submitAndContinue: EventEmitter<any> = new EventEmitter();

  @Output("rejectTender")
  rejectTender: EventEmitter<any> = new EventEmitter();
  
  @Output("updateTender")
  updateTender: EventEmitter<any> = new EventEmitter();

  formIdValue: any;
  QueryName: any;
  catagoryUpdatioFactor:any
  YearUpdationFactor:any
  acceptTnC1 = false
  acceptTnC2 = false
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.prefieldData.results && this.prefieldData.results.is_sent_for_approval){
      this.sentForApproval = true
    } else {
      this.sentForApproval = false
    }
    this.getUserDetails()
    this.ActiveMenu=this.datasharedservice.getLocalData('ActiveMenu');
  }
  
  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.setUpmodal()
    this.getUserDetails()
  }

  finalSurveySubmit(){
    this.validCheckforSurvey.emit();
    if(this.datasharedservice.getLocalData('ValidForm')=='false'){
      let tender:any = this.route.snapshot.paramMap.get('tenderid')
      var form_data = new FormData();
      form_data.append('tender_id', tender)
  
      this.apiservice.rolewiseSurveyComplete(form_data).subscribe(data=>{
        window.location.reload();
      })
    }
  }

  setUpmodal() {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteUser')
    );

    this.addOther = new window.bootstrap.Modal(
      document.getElementById('addOther')
    );

    this.catagoryUpdatioFactor = new window.bootstrap.Modal(
      document.getElementById('catagoryUpdatioFactor')
    );

    this.YearUpdationFactor = new window.bootstrap.Modal(
      document.getElementById('showYearUpdationFactor')
    );


  }

  showCatagoryUpdationFactor() {
    this.catagoryUpdatioFactor.show()
  }

  showYearUpdationFactor() {
    this.YearUpdationFactor.show()
  }

  addOtherDropdown(apiUrl:any,formId:any,Qparam:any) {
    this.otherApiUrl=apiUrl;
    this.formIdValue=formId;
    this.QueryName=Qparam;
    this.addOther.show()
  }
  AddOtherEmployee(){
    let body = {
      organization: this.localStorageData.organisation_details[0].id,
      employee_name:this.empName,
      form_id:this.formIdValue,
      query_name:this.QueryName
    }
    this.apiservice.addOtherEmployeeName(this.otherApiUrl,body).subscribe(data=>{
      this.toastrService.success(Success_Messages.SuccessAdd, '', {
        timeOut: 2000,
      });  
      this.empName='';
      let val={
        id:data.results.dependent_id,
        itemName:data.results.Data.employee_name,
        formId:this.formIdValue
      }
      this.parentFun.emit(val);
    })
  }

  reject() {
    this.rejectTender.emit();
  }

  conformation() {
    let data = {
      url:this.actionData.api_url,
      method:this.actionData.api_method,
      action:this.actionData
    }
    this.datasharedservice.saveLocalData('temp',JSON.stringify(data))
    this.updateTender.emit();
    // this.deleteModal.show()
  }

  conformation_back() {
    let data = {
      url:this.actionData.reverse_api_url,
      method:this.actionData.reverse_api_method,
      action:this.actionData
    }
    this.datasharedservice.saveLocalData('temp',JSON.stringify(data))
    this.updateTender.emit();
  }
  complete_survey(){
    let data = {
      url:this.actionData.survey_api_url,
      method:this.actionData.survey_api_method,
      action:this.actionData
    }
    this.datasharedservice.saveLocalData('temp',JSON.stringify(data))
    this.updateTender.emit();
  }

  getUserDetails() {
    if (this.route.snapshot.paramMap.get('tenderid')) {
      this.apiservice.gettenderUserDetails(this.route.snapshot.paramMap.get('tenderid')).subscribe(data => {
        this.actionData = data.results[0]
        if(data.results[0].tabular_enabled) {
          this.submitAndAddMore = true;
        }
      })
    }else {
      this.apiservice.gettenderUserpermission().subscribe(data => {
        this.submitAndAddMore = data.results[0].tabular_enabled
      })
    }
  }

  submit_Add_more() {
    this.submitAndContinue.emit();
  }
  
}
