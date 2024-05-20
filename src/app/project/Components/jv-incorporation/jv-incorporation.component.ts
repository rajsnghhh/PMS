import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-jv-incorporation',
  templateUrl: './jv-incorporation.component.html',
  styleUrls: ['./jv-incorporation.component.scss']
})
export class JvIncorporationComponent implements OnInit {

  tenderId: any = ''
  projectID: any = ''
  ActionButtonName = ''
  localStorageData: any;
  JvIncorpId: any;
  JvIncorpTenderId: any;
  formFieldList: any = [];
  buttonName: any = {
    project: true,
    btnName: 'Project Edit'
  };
  prefieldData: any = [];

  constructor(
    private route: ActivatedRoute,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private commonFunction: CommonFunctionService,
    private toastrService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.tenderId = this.route.snapshot.paramMap.get('tenderId');
    this.projectID = this.route.snapshot.paramMap.get('projectId');
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if(this.datasharedservice.getLocalData('jvIncorpid')){
      this.JvIncorpId = JSON.parse(this.datasharedservice.getLocalData('jvIncorpid')).id;
      this.JvIncorpTenderId = JSON.parse(this.datasharedservice.getLocalData('jvIncorpid')).tender;
    }
    if (this.tenderId != '' && this.projectID != '') {
      this.getProjectForm(this.tenderId);
      this.getPrefildData();
    }
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('edit-jv-incorporation')) {
      this.ActionButtonName = 'Submit'
    } else {
      this.ActionButtonName = 'Create'
    }
  }

  getProjectForm(tenderId: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', 'planning_jv_details');
    params.set('fetch_type', 'all')
    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.formFieldList = data.results;
    });
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
        id: this.projectID,
        form_type: 'planning_jv_details',
      }
    )

    this.saveProjectData(query, form_datatest, req.reloadRequired, req.tenderbuttonAction)

  }

  saveProjectData(query: string, data: any, reloadRequired: any, tenderbuttonAction: any) {
    this.apiservice.saveJVIncorpData(query, data).subscribe((data: any) => {
      let activeLink = this.router.url.split('/')
      if (activeLink.includes('edit-jv-incorporation')) {
        this.toastrService.success(Success_Messages.editSuccess, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.success(Success_Messages.CreateSucc, '', {
          timeOut: 2000,
        });
      }
      this.router.navigate(['/pms/project/jv-incorporation/' + this.JvIncorpTenderId + '/' + this.JvIncorpId]).then(() => {
        window.location.reload();
      });
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

  getPrefildData() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: this.projectID,
        form_menu_type: 'planning_jv_details',
        form_group_id: '',
        // list: true
      }
    )
    this.apiservice.getJVIncorpData(query).subscribe(data => {
      data.tender_data = data.project_data
      this.prefieldData = {
        results: data,
        Data: data
      };
    })
  }

  jvIcorpView() {
    this.router.navigate(['/pms/project/jv-incorporation/' + this.JvIncorpTenderId + '/' + this.JvIncorpId]);
  }

  jvIcorpEdit() {
    this.router.navigate(['/pms/project/edit-jv-incorporation/' + this.JvIncorpTenderId + '/' + this.JvIncorpId]);
  }

}
