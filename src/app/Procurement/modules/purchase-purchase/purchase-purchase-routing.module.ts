import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { GrnCancelCloseComponent } from './components/grn-cancel-close/grn-cancel-close.component';
import { PurchaseApprovalComponent } from './components/purchase-approval/purchase-approval.component';
import { PurchaseCheckComponent } from './components/purchase-check/purchase-check.component';
import { PurchaseRejectComponent } from './components/purchase-reject/purchase-reject.component';
import { PurchaseCancelCloseComponent } from './components/purchase-cancel-close/purchase-cancel-close.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseListComponent
  },
  {
    path: 'add',
    component: PurchaseComponent
  },
  {
    path: 'view/:purchaseID',
    component: PurchaseComponent
  },
  {
    path: 'view-gst/:purchaseID',
    component: PurchaseComponent
  },
  {
    path: 'update/:purchaseID',
    component: PurchaseComponent
  },
  {
    path: 'update-gst/:purchaseID',
    component: PurchaseComponent
  },
  {
    path: 'add-grn/:grnID',
    component: PurchaseComponent
  },
  {
    path: 'add-gst',
    component: PurchaseComponent
  },
  {
    path: 'cancel-close',
    component: GrnCancelCloseComponent
  },
  {
    path: 'approve',
    component: PurchaseApprovalComponent
  },
  {
    path: 'check',
    component: PurchaseCheckComponent
  },
  {
    path: 'reject',
    component: PurchaseRejectComponent
  },
  {
    path: 'cancel/close',
    component: PurchaseCancelCloseComponent
  },
  {
    path: 'add-gst-grn/:grnID',
    component: PurchaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasePurchaseRoutingModule { }
