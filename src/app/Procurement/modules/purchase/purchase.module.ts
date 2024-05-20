import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PoTopCardComponent } from '../purchase/po-components/po-top-card/po-top-card.component';
import { PurchaseOrderComponent } from '../purchase/po-components/purchase-order/purchase-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoTableDataComponent } from '../purchase/po-components/po-table-data/po-table-data.component';
import { PoTaxTermsPaymentComponent } from '../purchase/po-components/po-tax-terms-payment/po-tax-terms-payment.component';
import { PurchaseOrderListComponent } from '../purchase/po-components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderAdvanceSearchComponent } from '../purchase/po-components/purchase-order-advance-search/purchase-order-advance-search.component';
import { PrintPoComponent } from '../purchase/po-components/print-po/print-po.component';
import { NgxPrintModule } from 'ngx-print';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { PoGstComponent } from './po-gst-components/po-gst/po-gst.component';
import { PoGstTopCardComponent } from './po-gst-components/po-gst-top-card/po-gst-top-card.component';
import { PoGstSecondCardComponent } from './po-gst-components/po-gst-second-card/po-gst-second-card.component';
import { PoGstThirdCardComponent } from './po-gst-components/po-gst-third-card/po-gst-third-card.component';
import { PoGstTableDataComponent } from './po-gst-components/po-gst-table-data/po-gst-table-data.component';
import { PurchaseOrderCheckComponent } from './po-components/purchase-order-check/purchase-order-check.component';
import { PurchaseOrderCancelComponent } from './po-components/purchase-order-cancel/purchase-order-cancel.component';
import { PurchaseOrderApproveComponent } from './po-components/purchase-order-approve/purchase-order-approve.component';
import { PoCancelCloseComponent } from './po-components/po-cancel-close/po-cancel-close.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MultiStageApprovalComponent } from './po-components/multi-stage-approval/multi-stage-approval.component';
import { PaginateModule } from 'src/app/Shared/Module/paginate/paginate.module';


@NgModule({
  declarations: [
    PoTopCardComponent,
    PurchaseOrderComponent,
    PoTableDataComponent,
    PoTaxTermsPaymentComponent,
    PurchaseOrderListComponent,
    PurchaseOrderAdvanceSearchComponent,
    PrintPoComponent,
    PoGstComponent,
    PoGstTopCardComponent,
    MultiStageApprovalComponent,
    PoGstSecondCardComponent,
    PoGstThirdCardComponent, 
    PoGstTableDataComponent,
    PurchaseOrderCheckComponent,
    PurchaseOrderCancelComponent,
    PurchaseOrderApproveComponent,
    PoCancelCloseComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule,
    SharedModuleModule,
    AngularMultiSelectModule,
    PaginateModule
  ]
})
export class PurchaseModule { }
