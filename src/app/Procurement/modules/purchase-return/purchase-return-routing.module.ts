import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { PurchaseComponent } from './components/purchase/purchase.component';

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
    path: 'add-grn/:grnID',
    component: PurchaseComponent
  },
  {
    path: 'add-gst',
    component: PurchaseComponent
  },
  {
    path: 'add-gst-grn/:grnID',
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseReturnRoutingModule { }
