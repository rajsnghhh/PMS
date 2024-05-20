import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubletOrderComponent } from './sublet-order/sublet-order.component';

const routes: Routes = [
  {
    path: '',
    component: SubletOrderComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubletOrderRoutingModule { }
