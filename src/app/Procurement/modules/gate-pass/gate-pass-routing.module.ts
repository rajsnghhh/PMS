import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GatePassListComponent } from './components/gate-pass-list/gate-pass-list.component';
import { GatePassAddComponent } from './components/gate-pass-add/gate-pass-add.component';
import { TransportationComponent } from './components/transportation/transportation.component';

const routes: Routes = [
  { 
    path: '',
    component: GatePassListComponent 
  },
  {
    path: 'add',
    component: GatePassAddComponent 
  },
  {
    path: 'edit/:gatepassId',
    component: GatePassAddComponent 
  },
  {
    path: 'view/:gatepassId',
    component: GatePassAddComponent 
  },
  {
    path: 'approve-reject/:gatepassId',
    component: GatePassAddComponent 
  },
  {
    path: 'transportation',
    component: TransportationComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatePassRoutingModule { }
