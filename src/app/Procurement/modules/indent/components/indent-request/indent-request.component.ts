import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { IndentTopCardComponent } from '../indent-top-card/indent-top-card.component';
import { IndentRequestFormTableComponent } from '../indent-request-form-table/indent-request-form-table.component';
import { IndentRequestFormDataComponent } from '../indent-request-form-data/indent-request-form-data.component';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'app-indent-request',
  templateUrl: './indent-request.component.html',
  styleUrls: ['./indent-request.component.scss']
})
export class IndentRequestComponent {
  localStorageData: any;

  mrListIds: any;
  selectedMRDetails: any = [];
  private isAddIndentProcurementCalled = false;

  scope = ''
  prefieldData: any

  projectData:any = {}

  isIndent_Approver = false

  @ViewChild(IndentTopCardComponent) IndentTopCardComponent: any;
  @ViewChild(IndentRequestFormTableComponent) IndentRequestFormTableComponent: any;
  @ViewChild(IndentRequestFormDataComponent) IndentRequestFormDataComponent: any;

  constructor(
    private datasharedservice: DataSharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private activatedroute: ActivatedRoute,
    private apiservice: APIService,
    private commonFunction: CommonFunctionService,
    private procurementApiService: PROCUREMENTAPIService,
    private activeroute : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getUserDetails()

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.activatedRoute.paramMap.subscribe(params => {
      const mrIds = params.get('mrIds');
      this.mrListIds = mrIds ? mrIds.split(':').join(',') : '';
    });


    if (this.router.url.indexOf('/procurement/indent/request/modify') > -1) {
      this.scope = 'update'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/indent/request/view') > -1) {
      this.scope = 'view'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/indent/request/print') > -1) {
      this.scope = 'print'
      this.getPrefieldData()
    }else if (this.router.url.indexOf('/procurement/indent/create') > -1) {
      this.scope = 'create'
      // this.getPrefieldData()
    } else {
      this.scope = 'add'
      this.initMRListData();

    }
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions
      if (rolesArray.includes('procurement-indent-approver')) {
        this.isIndent_Approver = true
      }
    })
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

  getPrefieldData() {
    let params = new URLSearchParams();
    let indentID = JSON.parse(this.activatedroute.snapshot.paramMap.get('indentId') || '{}')

    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', indentID);
    this.procurementApiService.getProcurementIndentDetails(params).subscribe(data => {
      this.prefieldData = data
      this.getProjectData(this.prefieldData.project)
    });
  }

  initMRListData() {
    if(this.mrListIds != undefined) {
      let params = new URLSearchParams();
      params.set('id', this.mrListIds);
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.procurementApiService.getProcurementMaterialRequestItems(params).subscribe(data => {
        this.selectedMRDetails = data.results
      });
    }
  }

  createIndent() {
    this.IndentTopCardComponent.save()
    this.IndentRequestFormTableComponent.save()
    this.IndentRequestFormDataComponent.save()
  }

  updateIndent() {
    this.IndentTopCardComponent.save()
    this.IndentRequestFormTableComponent.save()
    this.IndentRequestFormDataComponent.save()
  }

  createData: any = {}


  appendData(req: any) {
    req = JSON.parse(req)
    this.createData = { ...this.createData, ...req };

    this.createData.indent_items = this.createData.requested_items;
    this.createData?.indent_items?.forEach((x: any) => {
      x.organization = this.localStorageData.organisation_details[0].id
    })
    // delete this.createData.requested_items;


    if (
      this.createData.indent_top_card &&
      this.createData.indent_form_table &&
      this.createData.indent_form_data &&
      !this.isAddIndentProcurementCalled
    ) {
      this.createData.organization = this.localStorageData.organisation_details[0].id;
      this.isAddIndentProcurementCalled = true;
      this.addIndentProcurement();
    }
  }

  addIndentProcurement() {
    if (this.scope == 'add' || this.scope == 'create') {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.createData.financialyear = this.localStorageData.financial_year[0].id
      this.procurementApiService.addProcurementMRIndent(this.createData).subscribe(
        (data) => {
          this.toastrService.success(Success_Messages.SuccessAdd, '', { timeOut: 2000 });
          this.backtolistIndent();
        },
        (error) => {
          this.isAddIndentProcurementCalled = false;
        }
      );
    }

    if (this.scope == 'update') {
      
      this.createData.attachments = this.createData.attachments.filter((items: { id: any; }) => !items.id)
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'edit');
      params.set('id', this.prefieldData?.id);
      //this.createData.project = this.prefieldData?.project

      this.procurementApiService.updateProcurementIndent(params, this.createData).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.backtolistIndent()
      },
        (error) => {
          this.isAddIndentProcurementCalled = false;
        });

    }


  }

  

  backtolistIndent() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent')
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}