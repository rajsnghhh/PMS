import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { GatePassAddTopCardComponent } from '../gate-pass-add-top-card/gate-pass-add-top-card.component';
import { GatePassAddTableComponent } from '../gate-pass-add-table/gate-pass-add-table.component';
import { GatePassAddBottomComponent } from '../gate-pass-add-bottom/gate-pass-add-bottom.component';

@Component({
  selector: 'app-gate-pass-add',
  templateUrl: './gate-pass-add.component.html',
  styleUrls: ['./gate-pass-add.component.scss']
})
export class GatePassAddComponent {
  localStorageData: any
  scope = ''
  prefieldData: any = {}
  projectData:any = {}
  isGP_Approver = false

  private isAddMRProcurementCalled = false;

  @ViewChild(GatePassAddTopCardComponent) GatePassAddTopCardComponent: any;
  @ViewChild(GatePassAddTableComponent) GatePassAddTableComponent: any;
  @ViewChild(GatePassAddBottomComponent) GatePassAddBottomComponent: any;

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
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getUserDetails()
    if (this.router.url.indexOf('/procurement/gate-pass/edit') > -1) {
      this.scope = 'update'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/gate-pass/approve-reject') > -1) {
      this.scope = 'view'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/gate-pass/view') > -1) {
      this.scope = 'view'
      this.getPrefieldData()
    } else {
      this.scope = 'add'
    }
    
  }

  checkApproverScope() {
    if (this.router.url.indexOf('/procurement/gate-pass/approve-reject') > -1){
      return true
    } else {
      return false
    }
  }


  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0].user_permissions
      if (rolesArray.includes("procurement-gatepass-approver")) {
        this.isGP_Approver = true
      }
    })
  }


  updateStatus(status:any) {
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'edit');
    params.set('id', this.prefieldData.id);
    this.prefieldData.status = status
    delete this.prefieldData.attachments
    this.procurementApiService.editGatePass(params, this.prefieldData).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      window.location.reload()
    });

    
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
    this.GatePassAddTopCardComponent.save()
    this.GatePassAddTableComponent.save()
    this.GatePassAddBottomComponent.save()
  }

  getPrefieldData() {
    let params = new URLSearchParams();
    let procurementID = JSON.parse(this.activeroute.snapshot.paramMap.get('gatepassId') || '{}')
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', procurementID);
    this.procurementApiService.getListGatePass(params).subscribe(data => {
      this.prefieldData = data
      // this.getProjectData(this.prefieldData.project)
    });
  }

  updateMR() {
    this.GatePassAddTopCardComponent.save()
    this.GatePassAddTableComponent.save()
    this.GatePassAddBottomComponent.save()
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
      this.createData.financialyear=this.localStorageData.financial_year[0].id

      
      this.procurementApiService.addGetPass(this.createData,params).subscribe(data => {
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

      this.procurementApiService.editGatePass(params, this.createData).subscribe(data => {
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
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/gate-pass')
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }


}
