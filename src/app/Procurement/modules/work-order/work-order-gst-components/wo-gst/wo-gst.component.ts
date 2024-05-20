import { Component, ViewChild } from '@angular/core';
import { WoGstTopCardComponent } from '../wo-gst-top-card/wo-gst-top-card.component';
import { WoGstTableCardComponent } from '../wo-gst-table-card/wo-gst-table-card.component';
import { WoGstLastCardComponent } from '../wo-gst-last-card/wo-gst-last-card.component';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-wo-gst',
  templateUrl: './wo-gst.component.html',
  styleUrls: ['./wo-gst.component.scss']
})
export class WoGstComponent {
  localStorageData: any;
  scope = ''
  prefieldData = '';
  @ViewChild(WoGstTopCardComponent) WoGstTopCardComponent: any;
  @ViewChild(WoGstTableCardComponent) WoGstTableCardComponent: any;
  @ViewChild(WoGstLastCardComponent) WoGstLastCardComponent: any;


  constructor(
    private datasharedservice: DataSharedService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }

  createData: any = {}
 
  appendData(req: any) {
    req = JSON.parse(req)
    this.createData = { ...this.createData, ...req };
    this.createData.type='gst'

    if (this.createData.wo_gst_top_Valid && this.createData.wo_gst_table_data_valid && this.createData.wo_gst_last_Valid) {
      this.addWorkOrderGST()
    }
  }


  addWorkOrderGST() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.localStorageData?.project_data?.id)
    params.set('site', this.localStorageData?.site_data?.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    
    this.createData.financialyear=this.localStorageData.financial_year[0].id;

    this.procurementApiService.addWorkOrder(this.createData, params).subscribe(
      (data) => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', { timeOut: 2000 });
       // this.backtolist();
      },
    );
  }


  createWO() {
    this.WoGstTopCardComponent.save()
    this.WoGstTableCardComponent.save()
    this.WoGstLastCardComponent.save()
  }

  backtolist() {
    this.RouteToRoll('/pms/' + this.activatedRoute.snapshot.paramMap.get('procurementScope') + '/procurement/work-order')
  }

  updateWO() {
   
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}

