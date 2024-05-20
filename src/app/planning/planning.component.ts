import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../Shared/Services/api.service';
import { NavigationService } from '../Shared/Services/navigation.service';
import { CommonFunctionService } from '../Shared/Services/common-function.service';
import { DynamicFormsComponent } from '../Shared/Module/dynamic-forms/dynamic-forms.component';
import { DelayMisComponent } from './components/delay-mis/delay-mis.component';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: [
    './planning.component.scss',
    '../../assets/scss/survey-common.scss',
    '../../assets/scss/from-coomon.scss'
  ]
})
export class PlanningComponent implements OnInit {
  MenuFormList: any;
  currentNav = '';
  openfromEvaluation = false;
  localStorageData: any;
  ActionButtonName = ''
  activeFromName = ''
  selectedTab = '';
  selectedIndex = ''
  form_type = '';
  formFieldListName = ''
  formFieldList: any;
  prefieldData: any = {};

  hideEditButtonScope = ['planning_sharing_site_schedule','planning_work_program']

  @ViewChild('fieldvalue') fieldvalue!:DelayMisComponent;

  tenderActionData: any = [];
  activeTab = 'view'
  tenderNumber: any = ''
  addPanningActions = false
  projectID: any = ''
  skipDynamicForm = ['planning_executive_summary']
  Planning = "Planning"
  projectData: any

  @ViewChild('dynamicForm')
  dynamicForm!: DynamicFormsComponent;

  constructor(
    private datasharedservice: DataSharedService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private apiservice: APIService,
    private navservice: NavigationService,
    private commonFunction: CommonFunctionService
  ) {
    this.navservice.currentNav().subscribe(data => {
      this.currentNav = data;
    }, err => {
      this.currentNav = 'basicDetails';
    });
  }

  ngOnInit(): void {
    this.tenderNumber = this.activeroute.snapshot.paramMap.get('tenderid')
    this.projectID = this.activeroute.snapshot.paramMap.get('projectid')
    this.datasharedservice.saveLocalData('tender_id', this.tenderNumber + '')
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('add-new')) {
      this.datasharedservice.saveLocalData('tender_id', '')
    } else {
      this.openfromEvaluation = true;
    }
    if (activeLink.includes('view')) {
      this.activeTab = 'view'
    } else {
      this.activeTab = 'edit'
    }
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjectDetails()
    this.getSideMenuList(true)
    // this.resumeTenderJourny()
    // this.getrouteSnap()
  }


  getProjectDetails() {
    let params = this.commonFunction.getURL({
      'organization_id': this.localStorageData.organisation_details[0].id,
      'id': this.projectID
    });
    // params.set('tender_id', this.datasharedservice.getLocalData('tender_id'))
    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectData = data
    });
  }

  inputCommingData(val: any) {
    this.genarateTenderDataMain(val,true)
  }

  toggoleViewEDIT() {
    let activeLink = this.router.url
    if (this.activeTab == 'view') {
      activeLink = activeLink.replace(/view/g, "edit")
    } else {
      activeLink = activeLink.replace(/edit/g, "view")
    }
    this.router.navigate([activeLink]).then(() => {
      window.location.reload();
    });
  }


  getSideMenuList(defaultTostart: boolean) {
    let params = new URLSearchParams();
    params.set('menu_id', '11')
    // params.set('tender_id', this.datasharedservice.getLocalData('tender_id'))
    this.apiservice.getPlanningMenuFormList(params).subscribe(data => {
      this.MenuFormList = data.results;
      if (defaultTostart) {
        this.changeNav(this.MenuFormList[0].form_name, this.MenuFormList[0].form_type_name, this.MenuFormList[0].button_name, 0)
        // this.ActionButtonName = this.MenuFormList[0].button_name
      }
      this.addPanningActions = true
    });
  }

  changeNav(nav: string, formtype: any, button_name: string, index: any) {
    this.selectedTab = '';
    this.selectedIndex = index
    this.form_type = formtype
    // this.ActionButtonName = button_name
    this.navservice.changeNav(nav);
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', formtype)
    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.activeFromName = formtype;
      if (data?.results?.length > 0) {
        if (data.results[0].form_type == "planning_risk_evaluation") {
          data.results = data.results.filter((x: any) => x.name != "Risk Details");
        }
      }
      this.formFieldList = data.results; //From Json
      this.formFieldListName = nav;
      this.changeSelectedTab(formtype)
      this.prefieldData = {}
      this.getPlanningPrefieldData()
      // if (this.TenderNumber != 'null') {
      //   this.getPrefildData();
      // }
      if (this.dynamicForm) {
        this.dynamicForm.resetForm()
      }
    });
    this.scrollToTop()
  }

  changeSelectedTab(tab: any): void {
    this.selectedTab = tab;
  }

  scrollToTop() {
    let element = document.getElementById("scrollTO");
    if (element) {
      element.scrollIntoView();
    }
  }

  genarateTenderData(Data: any) {
    this.genarateTenderDataMain(Data,false)
  }
  genarateTenderDataMain(Data: any,callingForClieldUpdate:boolean) {
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
        id: this.projectID,
        form_type: this.selectedTab,
      }
    )
    this.apiservice.saveProjectData(query,form_datatest).subscribe(data => {
      if(callingForClieldUpdate == true) {
        this.fieldvalue.callFromParent(); 
      } else {
        this.proceedNext()
      }
    });

  }

  getPlanningPrefieldData() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: this.projectID,
        form_menu_type: this.selectedTab,
      }
    )
    this.apiservice.getProjectData(query).subscribe(data => {
      let temp = {
        results: {
          tender_data: data.project_data
        }
      }
      this.prefieldData = temp
    });

  }

  savePlanning() {
    // saveProjectData
  }


  proceedNext() {
    for (let i = 0; i < this.MenuFormList.length; i++) {
      if (this.MenuFormList[i].form_type_name == this.selectedTab) {
        if (i < this.MenuFormList.length - 1) {
          let navData: any = this.MenuFormList[i + 1]
          this.changeNav(navData.form_name, navData.form_type_name, navData.button_name, i + 1)
        }
      }
    }
  }
}
