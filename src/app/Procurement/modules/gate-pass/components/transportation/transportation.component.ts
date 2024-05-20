import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: [
    './transportation.component.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class TransportationComponent implements OnInit {
  gatePassList :any = []
  disabledEdit = false
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    public router: Router,
    private toastrService: ToastrService,
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

  claculate(index:any) {
    this.gatePassList[index].diff = this.gatePassList[index].chainage_to - this.gatePassList[index].chainage_from
    this.gatePassList[index].other_km = this.gatePassList[index].diff - this.gatePassList[index].first_km
    this.gatePassList[index].amount = (parseInt(this.gatePassList[index].other_km) * parseInt(this.gatePassList[index].rate_per_km)) + parseInt(this.gatePassList[index].first_rate)
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0].user_permissions
      if (rolesArray.includes("procurement-gatepass-approver")) {
        this.isGP_Approver = true
      }
    })
  }

  update(index:any) {
    this.gatePassList[index]
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method', 'edit');
    params.set('id', this.gatePassList[index].id);
    // delete this.prefieldData.attachments

    this.procurementApiService.editGatePass(params, this.gatePassList[index]).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      window.location.reload()
    });

  }

  getList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiService.getListGatePass(params).subscribe(data => {
      this.gatePassList = data.results;
    })
    
  }
}
