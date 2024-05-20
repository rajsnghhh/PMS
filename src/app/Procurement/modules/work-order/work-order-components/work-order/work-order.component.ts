import { Component, ViewChild } from '@angular/core';
import { WorkOrderTopCardComponent } from '../work-order-top-card/work-order-top-card.component';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrderTableCardComponent } from '../work-order-table-card/work-order-table-card.component';
import { WorkOrderLastCardComponent } from '../work-order-last-card/work-order-last-card.component';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss']
})
export class WorkOrderComponent {
  localStorageData: any;
  scope = ''
  prefieldData = '';
  // purchaseOrderId: any = '';
  // indentId: any = '';
  @ViewChild(WorkOrderTopCardComponent) WorkOrderTopCardComponent: any;
  @ViewChild(WorkOrderTableCardComponent) WorkOrderTableCardComponent: any;
  @ViewChild(WorkOrderLastCardComponent) WorkOrderLastCardComponent: any;


  constructor(
    private datasharedservice: DataSharedService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    // if (this.router.url.indexOf('/procurement/grn/modify') > -1) {
    //   this.scope = 'update'
    //   this.getPrefieldData()
    // } else if (this.router.url.indexOf('/procurement/grn/view') > -1) {
    //   this.scope = 'view'
    //   this.getPrefieldData()
    // } else if (this.router.url.indexOf('/procurement/grn/print') > -1) {
    //   this.scope = 'print'
    //   this.getPrefieldData()
    // } else {
    //   this.scope = 'add'
    // }

    // this.activatedRoute.paramMap.subscribe(params => {

    //   this.purchaseOrderId = params.get('poId');
    //   this.indentId = params.get('indentId');
    // });


  }

  createData: any = {}
  // private isGrnAddCalled = false;

  // getPrefieldData() {
  //   let params = new URLSearchParams();
  //   let grnId = JSON.parse(this.activatedRoute.snapshot.paramMap.get('grnId') || '{}')

  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('id', grnId);

  //   this.procurementApiService.getGRNDetails(params).subscribe(data => {
  //     this.prefieldData = data

  //   });

  // }

  appendData(req: any) {

    req = JSON.parse(req)
    this.createData = { ...this.createData, ...req };

    // if (
    //   this.createData.grn_top_Valid &&
    //   this.createData.grn_table_data &&
    //   !this.isGrnAddCalled
    // ) {
    //   this.createData.organization = this.localStorageData.organisation_details[0].id;
    //   this.isGrnAddCalled = true;
    //   this.addGRN();
    // }

    if (this.createData.wo_top_Valid && this.createData.wo_table_data_valid && this.createData.wo_last_Valid) {
      this.addWorkOrder()
    }
  }


  addWorkOrder() {
    // if (this.purchaseOrderId) {
    //   this.createData.purchase_order = this.purchaseOrderId;
    // }
    // if (this.indentId) {
    //   this.createData.indent = this.indentId;
    // }


    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.localStorageData?.project_data?.id)
    params.set('site', this.localStorageData?.site_data?.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);

    this.createData.financialyear=this.localStorageData.financial_year[0].id;
    this.procurementApiService.addWorkOrder(this.createData, params).subscribe(
      (data) => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', { timeOut: 2000 });
        this.backtolist();
      },

      // (error) => {
      //   this.isGrnAddCalled = false;
      // }
    );
  }

  // if (this.scope == 'update') {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('method', 'edit');
  //   params.set('id', this.prefieldData?.id);
  //   this.createData.project = this.prefieldData?.project

  //   this.procurementApiService.updateProcurementIndent(params, this.createData).subscribe(data => {
  //     this.toastrService.success(Success_Messages.SuccessUpdate, '', {
  //       timeOut: 2000,
  //     });
  //     this.backtolistIndent()
  //   },
  //     (error) => {
  //       this.isAddIndentProcurementCalled = false;
  //     });

  // }



  createWO() {
    this.WorkOrderTopCardComponent.save()
    this.WorkOrderTableCardComponent.save()
    this.WorkOrderLastCardComponent.save()
  }

  backtolist() {
    this.RouteToRoll('/pms/' + this.activatedRoute.snapshot.paramMap.get('procurementScope') + '/procurement/work-order')
  }

  updateWO() {
    // this.WorkOrderTopCardComponent.save()
    // this.WorkOrderTableCardComponent.save()
    // this.WorkOrderLastCardComponent.save()
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
