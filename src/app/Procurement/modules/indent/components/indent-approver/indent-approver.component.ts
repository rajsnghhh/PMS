import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-indent-approver',
  templateUrl: './indent-approver.component.html',
  styleUrls: ['./indent-approver.component.scss']
})

export class IndentApproverComponent implements OnInit, OnChanges {
  form: any = {};
  disabledEdit = false
  localStorageData: any
  @Input() prefieldData: any;
  @Input() isIndent_Approver: any;
  editData: any = {}
  indentId: any;
  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private router: Router,
    private activeroute : ActivatedRoute,
    private procurementApiService:PROCUREMENTAPIService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

  }

  changeStatus(data: any) {
    this.editData.status = data
  }

  onSubmit() {
    if (this.editData.status != '') {
      let req = [{
        id: this.prefieldData.id,
        status: this.editData.status
      }]
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('type', 'indent');
      this.procurementApiService.updateProcurementSatatus(params, req).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.backtolist();
      })
    }
  }

  backtolist() {
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

