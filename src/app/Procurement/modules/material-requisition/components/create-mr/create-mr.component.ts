import { Component, OnInit, ViewChild } from '@angular/core';
import { MrTopCardComponent } from '../mr-top-card/mr-top-card.component';
import { CreateMrTableComponent } from '../create-mr-table/create-mr-table.component';
import { FormBelowCreateMrTableComponent } from '../form-below-create-mr-table/form-below-create-mr-table.component';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'app-create-mr',
  templateUrl: './create-mr.component.html',
  styleUrls: [
    './create-mr.component.scss'
  ]
})
export class CreateMrComponent implements OnInit {
  localStorageData: any
  scope = ''
  prefieldData: any = {}
  projectData:any = {}

  isMR_Approver = false

  private isAddMRProcurementCalled = false;

  @ViewChild(MrTopCardComponent) MrTopCardComponent: any;
  @ViewChild(CreateMrTableComponent) CreateMrTableComponent: any;
  @ViewChild(FormBelowCreateMrTableComponent) FormBelowCreateMrTableComponent: any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService
  ) {

  }

  ngOnInit(): void {
    this.getUserDetails()
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.router.url.indexOf('/procurement/mr/modify') > -1) {
      this.scope = 'update'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/mr/view') > -1) {
      this.scope = 'view'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/mr/print') > -1) {
      this.scope = 'print'
      this.getPrefieldData()
    } else {
      this.scope = 'add'
    }
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0].user_permissions
      if (rolesArray.includes('procurement-mr-approver')) {
        this.isMR_Approver = true
      }
    })
    // this.isMR_Approver = true
  }


  getProjectData(projectId:any) {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: projectId,
      }
    )
    this.apiservice.getProjectData(query).subscribe(data => {
      this.projectData = data.project_data
    })
  }

  createMR() {
    this.MrTopCardComponent.save()
    this.CreateMrTableComponent.save()
    this.FormBelowCreateMrTableComponent.save()
  }

  getPrefieldData() {
    let params = new URLSearchParams();
    let procurementID = JSON.parse(this.activeroute.snapshot.paramMap.get('mrId') || '{}')
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', procurementID);
    this.procurementApiService.getProcurementMRDetails(params).subscribe(data => {
      this.prefieldData = data
      this.getProjectData(this.prefieldData.project)
    });
  }

  updateMR() {
    this.MrTopCardComponent.save()
    this.CreateMrTableComponent.save()
    this.FormBelowCreateMrTableComponent.save()
  }

  createData: any = {}

  appendData(req: any) {
    req = JSON.parse(req)
    this.createData = { ...this.createData, ...req };

    if (
      this.createData.mr_table &&
      this.createData.mr_bottom &&
      this.createData.mr_TopValid &&
      !this.isAddMRProcurementCalled
    ) {
      this.createData.organization = this.localStorageData.organisation_details[0].id;
      this.isAddMRProcurementCalled = true;
      this.addProcurement();
    }

  }

  addProcurement() {
    if (this.scope == 'add') {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.createData.financialyear = this.localStorageData.financial_year[0].id;
      this.apiservice.addProcurementMR(params, this.createData).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });       
        this.backtolist()
      },
        (error) => {
          this.isAddMRProcurementCalled = false;
        });
    }
    if (this.scope == 'update') {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'edit');
      params.set('id', this.prefieldData.id);

      this.apiservice.updateProcurementMR(params, this.createData).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.backtolist()
      },
        (error) => {
          this.isAddMRProcurementCalled = false;
        });

    }
  }

  backtolist() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/mr')
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
