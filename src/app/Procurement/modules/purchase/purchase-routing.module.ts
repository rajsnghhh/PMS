import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from '../purchase/po-components/purchase-order/purchase-order.component';
import { PurchaseOrderAdvanceSearchComponent } from '../purchase/po-components/purchase-order-advance-search/purchase-order-advance-search.component';
import { PrintPoComponent } from '../purchase/po-components/print-po/print-po.component';
import { PoGstComponent } from './po-gst-components/po-gst/po-gst.component';
import { PoCancelCloseComponent } from './po-components/po-cancel-close/po-cancel-close.component';
import { MultiStageApprovalComponent } from './po-components/multi-stage-approval/multi-stage-approval.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseOrderAdvanceSearchComponent
  },
  {
    path: 'create',
    component: PurchaseOrderComponent
  },
  {
    path: 'amend/:poId',
    component: PurchaseOrderComponent
  },
  {
    path: 'amend-gst/:poId',
    component: PoGstComponent
  },
  {
    path: 'cancel-close',
    component: PoCancelCloseComponent
  },
  {
    path: 'create-through-indent/:indentID',
    component: PurchaseOrderComponent
  },
  {
    path: 'create-through-quotation/:quotationID',
    component: PurchaseOrderComponent
  },
  {
    path: 'print/:poId',
    component: PrintPoComponent
  },
  {
    path: 'create/gst',
    component: PoGstComponent
  },
  {
    path: 'update/:poId',
    component: PurchaseOrderComponent
  },
  {
    path: 'update/gst/:poId',
    component: PoGstComponent
  },
  {
    path: 'view/:poId',
    component: PurchaseOrderComponent
  },
  {
    path: 'view/gst/:poId',
    component: PoGstComponent
  },
  {
    path: 'create-through-indent/gst/:indentID',
    component: PoGstComponent
  },
  {
    path: 'create-through-quotation/gst/:quotationID',
    component: PoGstComponent
  },
  {
    path: 'multistage-approval',
    component: MultiStageApprovalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
