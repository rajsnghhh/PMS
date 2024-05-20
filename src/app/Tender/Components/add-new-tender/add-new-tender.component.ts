import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from 'src/app/Shared/Services/navigation.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DynamicFormsComponent } from 'src/app/Shared/Module/dynamic-forms/dynamic-forms.component';
import { PmsLoaderService } from 'src/app/Shared/Services/pms-loader.service';
declare var window: any;

@Component({
  selector: 'app-add-new-tender',
  templateUrl: './add-new-tender.component.html',
  styleUrls: ['./add-new-tender.component.scss',
    '../../../../assets/scss/survey-common.scss',
    '../../../../assets/scss/from-coomon.scss'
  ]
})
export class AddNewTenderComponent implements OnInit {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  currentNav = '';
  MenuFormList: any;
  ActionButtonName = ''
  localStorageData: any;
  tenderFlags:any;
  formFieldList: any = [];
  formFieldListName = 'Tender';
  activeFromName = '';
  TenderNumber = 'null'
  form_type = ''
  showAlert = false;
  tenderdata: any = {}
  responseData: any = [];
  tempData = ''
  prefieldData: any = [];
  tenderActionData:any = []
  selectedTab = '';
  disableDynamicFormScope = ['tender_executive_commitee','tender_survey_details','tender_final_approval','percentage_share_analytics']
  surveySatus = 'userAssigned'
  surveyDataOpen = false
  openfromEvaluation = false
  tempformFieldList:any
  @ViewChild('dynamicForm')
  dynamicForm!: DynamicFormsComponent;
  openTab = ''
  UsingIn = "Tender"

  constructor(
    private navservice: NavigationService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private router: Router,
    private activeroute : ActivatedRoute,
    private commonFunction: CommonFunctionService,
    private loaderservice: PmsLoaderService
  ) {
    this.navservice.currentNav().subscribe(data => {
      this.currentNav = data;
    }, err => {
      this.currentNav = 'basicDetails';
    });
  }

  ngOnInit(): void {
    this.datasharedservice.saveLocalData('tender_id',this.activeroute.snapshot.paramMap.get('tenderid')+'') 
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('add-new')) {
      this.datasharedservice.saveLocalData('tender_id','') 
    }else {
      this.openfromEvaluation = true;
    }
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSideMenuList(true)
    this.resumeTenderJourny()
    this.getrouteSnap()
  }

  getrouteSnap() {
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('edit')) {
      this.openTab = 'edit'
    } else {
      this.openTab = 'view'
    }
  }

  resumeTenderJourny() {
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('continue-tender')) {
      if (this.datasharedservice.getLocalData('tender_id')) {
        this.TenderNumber = this.datasharedservice.getLocalData('tender_id');
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    } else {
      this.datasharedservice.removeLocalData('tender_id')
    }

  }

  scrollToTop() {
    let element = document.getElementById("scrollTO");
    if (element) {
      element.scrollIntoView();
    }
  }

  proceedNext() {
    this.changeNav('Formation Of Executive Commitee','tender_executive_commitee','Submit')
    // this.navservice.changeNav('locationDetails');
  }

  getSideMenuList(defaultTostart:boolean) {
    let params = new URLSearchParams();
    params.set('menu_id', '3')
    params.set('tender_id', this.datasharedservice.getLocalData('tender_id'))
    this.apiservice.getMenuFormList(params).subscribe(data => {
      this.MenuFormList = data.results;
      // if(defaultTostart == false){
      //   for(let i=0;i<this.MenuFormList.length;i++) {
      //     if(this.MenuFormList[i].project_creation_after_submission) {
      //       this.loaderservice.showWithMessage('Creating Project !')
      //       this.router.navigate(['pms/project']).then(() => {
      //         window.location.reload()
      //         this.loaderservice.hide()
      //       });
      //     }
      //   }
      // }
      if(defaultTostart){
        this.changeNav(this.MenuFormList[0].form_name, this.MenuFormList[0].form_type_name,this.MenuFormList[0].button_name)
        this.ActionButtonName = this.MenuFormList[0].button_name
      }
    });
  }

  showNav(currentNav:any) {
    return false
  }

  changeNav(nav: string, formtype: any,button_name:string) {
    this.datasharedservice.saveLocalData('ActiveMenu',formtype);
    this.selectedTab = '';
    this.form_type = formtype
    this.ActionButtonName = button_name
    this.navservice.changeNav(nav);
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', formtype);
    if(formtype=='tender_survey_details'){
      params.set('tender_id',this.datasharedservice.getLocalData('tender_id'));
    }
    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.activeFromName = formtype;      
      this.formFieldList = data.results;
      if(data.results.length > 0) {
        if(data.results[0].form_type == 'tender_executive_summary' || data.results[0].form_type == 'tender_top_sheet') {
          this.tempformFieldList = this.formFieldList
          this.formFieldList = [];
        }
      }
      this.formFieldListName = nav;
      this.prefieldData = []
      if (this.TenderNumber != 'null') {
        this.getPrefildData();
      }
      this.changeSelectedTab(formtype)
      // if (this.activeFromName == 'tender_survey_details') {
      //   let query = {
      //     'tender_id': this.TenderNumber,
      //     'form_type': this.form_type,
      //   }
      //   this.formFieldList.push(query)
      //   this.datasharedservice.setObservableData(this.formFieldList)
      // } // Survey removerd from web 
      if(this.dynamicForm){
        this.dynamicForm.resetForm()
      }
    });
    this.scrollToTop()
  }


  getPrefildData() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: this.TenderNumber,
        form_menu_type: this.activeFromName
      }
    )

    this.apiservice.getTenderData(query).subscribe(data => {
      
      this.prefieldData = data; 
      if(data.Data.is_resend_for_recommendations) {
        this.showAlert = true
      }
      this.responseData = data.Data.tender_data
      this.tenderFlags = data.results
    });
  }

  changeNavfromResponse(data: string,changeNavfromResponse:any) {
    if (data == 'last') {
      this.router.navigate(['/pms/tender/evaluations-summary']).then(() => {
        window.location.reload();
      });
    }else if(data == 'project_details') {
      this.loaderservice.showWithMessage('Creating Project !')
      this.router.navigate(['pms/project/create-project/'+this.activeroute.snapshot.paramMap.get('tenderid')+'/'+changeNavfromResponse.project_id]).then(() => {
        setTimeout(() => {
          // window.location.reload()
          this.loaderservice.hide()
        }, 1000)
      });
    } else {
      for (let i = 0; i < this.MenuFormList.length; i++) {
        if (this.MenuFormList[i].form_type_name == data) {
          this.changeNav(this.MenuFormList[i].form_name, data,this.MenuFormList[i].button_name)
          this.ActionButtonName = this.MenuFormList[i].button_name
          break
        }
      }
    }
  }

  genarateTenderData(Data: any) {
    let req = JSON.parse(Data)
    let form_datatest = new FormData();
    for (const [key, value] of Object.entries(req.data)) {
      if (value) {
        form_datatest.append(key, value.toString())
      }
    }
    let fileSet = this.datasharedservice.getObservableData1()
    for (var key in fileSet) {
      form_datatest.append(key, fileSet[key])
    }
    this.datasharedservice.setObservableData({})
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        tender_id: this.TenderNumber,
        form_type: this.form_type,
        on_submission_open: this.getNextNav()
      }
    )

    this.saveTenderData(query, form_datatest,req.reloadRequired,req.tenderbuttonAction)

  }

  getNextNav() {
    for(let i=0;i<this.MenuFormList.length;i++) {
      if(this.MenuFormList[i].form_type_name == this.activeFromName) {
        if(i == this.MenuFormList.length-1) {
          return ''
        }else{
          return this.MenuFormList[i+1].form_type_name
        }
      }
    }
  }


  saveTenderData(query: string, data: any,reloadRequired:any,tenderbuttonAction:any) {
    this.apiservice.saveTenderData(query, data).subscribe((data: any) => {
      this.toastrService.success(Success_Messages.SuccessAdd, '', {
        timeOut: 2000,
      });

      this.getSideMenuList(false)

      if(tenderbuttonAction == 'reject') {
        this.rejectTenderproposer()
      }
      if(tenderbuttonAction == 'updateStatus') {
        this.updateTenderStatus()
      }else{
        if(reloadRequired == true) {
          window.location.reload();
        }else {
          this.TenderNumber = data.results.Data.id
          this.responseData = data.results.Data.tender_data
          this.submitSuccess(data.next,data)
        }
      }
    }, err => {
      if (err.error.error) {
        this.toastrService.error(err.error.error, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      }
    })
  }

  rejectTenderproposer() {
    let query = this.commonFunction.getURL(
      {
        tender_id: this.TenderNumber,
      }
    )
    this.apiservice.rejectTender(query).subscribe(data => {
      this.router.navigate(['/pms/tender/evaluations-summary']).then(() => {
        window.location.reload();
      });
    });

  }

  updateTenderStatus() {
    if(this.datasharedservice.getLocalData('temp')){
      let data = JSON.parse(this.datasharedservice.getLocalData('temp'))
      this.apiservice.updateStatus(data.url,data.method).subscribe(response => {
        this.toastrService.success(response.msg, '', {
          timeOut: 2000,
        });
        setTimeout(()=>{                           
          this.dynamicAction(data)
        }, 2000);
      })
    }
  }

  dynamicAction(data:any) {
    if(data.url.includes("reversed")) {
      window.location.reload();
    }
    if(data.action.form_type == 'tender_executive_commitee') {
      this.submitSuccess('tender_executive_commitee',data)
    }else if(data.action.form_type == 'last') {
      this.router.navigate(['/pms/tender/evaluations-summary']).then(() => {
        window.location.reload();
      });
    } else {
      this.proceedNextStep(data) 
    }
  }


  // startSurvey(path: any) {
  //   this.router.navigate([path])
  // }
  //(click)="startSurvey('/pms/survey')"

  viewSurvey() {
    const index = this.disableDynamicFormScope.indexOf('tender_survey_details');
    if (index > -1) { 
      this.disableDynamicFormScope.splice(index, 1);
    }
    this.surveyDataOpen = true
  }

  surveyComplete(){
  
    var form_data = new FormData();
    form_data.append('tender_id', this.TenderNumber)

    this.apiservice.completeSurvey(form_data).subscribe(data => {
      window.location.reload();
    })

  }

  submitSuccess(data: any,responseObj:any) {
    this.tempData = data
    setTimeout(() => {
      this.proceedNextStep(responseObj)
    }, 1000)
  }

  proceedNextStep(responseObj:any) {
    this.changeNavfromResponse(this.tempData,responseObj)
  }

  changeSelectedTab(tab: any): void {
    this.selectedTab = tab;
  }
  next() {
    
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {

    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
}
