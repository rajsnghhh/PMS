import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyBillAddeditComponent } from './party-bill-addedit/party-bill-addedit.component';
import { PartyBillListComponent } from './party-bill-list/party-bill-list.component';
import { PartyBillAcceptComponent } from './party-bill-accept/party-bill-accept.component';

const routes: Routes = [
  {
    path: '',
    component: PartyBillListComponent
  },
  {
    path: 'add',
    component: PartyBillAddeditComponent
  },
  { 
    path: 'update/:editId',
    component: PartyBillAddeditComponent 
  },
  {
    path: 'list',
    component: PartyBillListComponent
  },
  {
    path: 'accept',
    component: PartyBillAcceptComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyBillReceiveRoutingModule { }
