import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-work-order-list',
  templateUrl: './work-order-list.component.html',
  styleUrls: ['./work-order-list.component.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
    '../../../../../../assets/scss/tableactionButton.scss',
    '../../../../../../assets/scss/from-coomon.scss',
  ]
})
export class WorkOrderListComponent {
  localStorageData: any;
  woList: Array<any> = []
  WO_Checker = false
  WO_Approver = false

  @Input() workOrderAdvancedSearchFormValue: any;


  constructor(
    private procurementAPIService: PROCUREMENTAPIService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    public router: Router,
    private activetroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getWorkOrderList();
    this.getUserDetails()
  }

  ngOnChanges() {
    if (this.workOrderAdvancedSearchFormValue) {
      this.getWorkOrderList()
    }
  }

  getWorkOrderList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('project', this.localStorageData?.project_data?.id)
    params.set('site', this.localStorageData?.site_data?.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    if (!this.workOrderAdvancedSearchFormValue) {
      params.set('all', 'true');
    }

    if (this.workOrderAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.workOrderAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }
    this.procurementAPIService.getWOList(params).subscribe(data => {
      this.woList = data.results;
      if (this.woList.length == 0) {
        this.toastrService.error('No data found', '', {
          timeOut: 2000,
        });
      }
    })
  }

  updateSatus() {
    let req :any = []

    for(let i=0;i<this.woList.length;i++) {
      if(this.woList[i].updatedStatus) {
        req.push({
          "id": this.woList[i].id,
          "status": this.woList[i].updatedStatus
        })
      }
    }
    if(req.length > 0) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('type', 'work-order');
      this.procurementAPIService.updateProcurementSatatus(params, req).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        window.location.reload()
      })
    } else {
      this.toastrService.error('No Status change detected.', '', {
        timeOut: 2000,
      });
    }
        
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions
      if (rolesArray.includes('procurement-wo-approver')) {
        this.WO_Approver = true
      }
      if (rolesArray.includes('procurement-wo-checker')) {
        this.WO_Checker = true
      }    
    })
  }

  
  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

  // printByID(id: any) {
  //   this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/grn/print/' + id)
  // }

  // viewByID(id: any) {
  //   this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/grn/view/' + id)
  // }

  // updateByID(id: any) {
  //   this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/grn/modify/' + id)
  // }
  
}