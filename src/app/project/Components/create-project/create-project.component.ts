import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  tenderId: any = ''
  projectID: any = ''
  ActionButtonName = ''
  localStorageData: any
  formFieldList: any = [];
  prefieldData: any = [];
  constructor(
    private route: ActivatedRoute,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private commonFunction: CommonFunctionService,
    private toastrService: ToastrService,
    private router: Router,
  ) {

  }
  ngOnInit(): void {
    this.tenderId = this.route.snapshot.paramMap.get('tenderId');
    this.projectID = this.route.snapshot.paramMap.get('projectId');
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.tenderId != '' && this.projectID != '') {
      this.getProjectForm(this.tenderId);
      this.getPrefildData()
    }
    let activeLink = this.router.url.split('/')
    if (activeLink.includes('edit-project')) {
      this.ActionButtonName = 'Edit'
    } else {
      this.ActionButtonName = 'Create'
    }
  }

  getProjectForm(tenderId: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', 'project_details')
    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.formFieldList = data.results
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
        form_type: 'project_details',
        on_submission_open: ''
      }
    )

    this.saveProjectData(query, form_datatest,req.reloadRequired,req.tenderbuttonAction)

  }

  saveProjectData(query: string, data: any,reloadRequired:any,tenderbuttonAction:any) {
    this.apiservice.saveProjectData(query, data).subscribe((data: any) => {
      let activeLink = this.router.url.split('/')
      if (activeLink.includes('edit-project')) {
        this.toastrService.success(Success_Messages.editSuccess, '', {
          timeOut: 2000,
        });
      } else {
        this.toastrService.success(Success_Messages.CreateSucc, '', {
          timeOut: 2000,
        });
      }
      this.router.navigate(['/pms/project']).then(() => {
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
        form_menu_type: 'project_details'
      }
    )
    this.apiservice.getProjectData(query).subscribe(data => {
      data.tender_data = data.project_data
      this.prefieldData = {
        results : data,
        Data: data
      };
    })
  }


}
