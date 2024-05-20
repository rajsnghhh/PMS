import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-grn-check',
  templateUrl: './grn-check.component.html',
  styleUrls: ['./grn-check.component.scss']
})
export class GrnCheckComponent implements OnInit, OnChanges {


  form: any = {};
  disabledEdit = false
  localStorageData: any
  @Input() prefieldData: any;
  @Input() isGRN_Checker: any;
  editData: any = {}

  constructor(
    private datasharedservice: DataSharedService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute
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
      params.set('type', 'grn');
      this.procurementApiService.updateProcurementSatatus(params, req).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.backtolist();
      })
    }
  }

  backtolist() {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/grn')
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
