import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoucherLinkingComponent } from './components/voucher-linking/voucher-linking.component';
import { VoucherLinkingOperationComponent } from './components/voucher-linking-operation/voucher-linking-operation.component';

const routes: Routes = [
  {
    path: '',
    component: VoucherLinkingComponent,
    pathMatch: 'full'
  },
  {
    path : ':linksource/:linkto',
    component : VoucherLinkingOperationComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherLinkingRoutingModule { }
