import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportBillListComponent } from './transport-bill-list/transport-bill-list.component';
import { TransportBillAddComponent } from './transport-bill-add/transport-bill-add.component';
import { TransportBillApproveComponent } from './transport-bill-approve/transport-bill-approve.component';
import { TransportBillFormComponent } from './transport-bill-form/transport-bill-form.component';

const routes: Routes = [
  {
    path: '',
    component:TransportBillListComponent
  },
  {
    path: 'list',
    component:TransportBillListComponent
  },
  {
    path: 'create',
    component: TransportBillAddComponent
  },
  {
    path: 'create-bill',
    component: TransportBillFormComponent
  },
  {
    path: 'approve',
    component: TransportBillApproveComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportBillRoutingModule { }
