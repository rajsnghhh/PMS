import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialReqPlanComponent } from './components/material-req-plan/material-req-plan.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialReqPlanComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
