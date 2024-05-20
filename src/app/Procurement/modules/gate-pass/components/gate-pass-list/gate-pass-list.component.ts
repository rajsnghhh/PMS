import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gate-pass-list',
  templateUrl: './gate-pass-list.component.html',
  styleUrls: [
    './gate-pass-list.component.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss'
  ]
})
export class GatePassListComponent {
  
  gatePassList :any = []

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    public router: Router,
    private toastrService: ToastrService,
    private activeroute: ActivatedRoute,
    private procurementApiService : PROCUREMENTAPIService,
    private commonfunction: CommonFunctionService
  ) { }

  localStorageData : any
  docUrl = ''
  isGP_Approver = false

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getUserDetails()
    this.docUrl = environment.API_URL1+ ''

    this.getList()
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0].user_permissions
      if (rolesArray.includes("procurement-gatepass-approver")) {
        this.isGP_Approver = true
      }
    })
  }

  getList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    params.set('all', 'true');
    this.procurementApiService.getListGatePass(params).subscribe(data => {
      this.gatePassList = data.results;
    })
    
  }

  addNew() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/gate-pass/add')
  }

  updateByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/gate-pass/edit/' + id)
  }

  transportation() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/gate-pass/transportation/')
  }

  viewByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/gate-pass/view/' + id)
  }


  approveRejectByID(id: any) {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/gate-pass/approve-reject/' + id)
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

}
