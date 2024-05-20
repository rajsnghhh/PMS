import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanningComponent } from './planning.component';

const routes: Routes = [
  { 
    path: 'view/:tenderid/:projectid',
    component: PlanningComponent 
  },
  { 
    path: 'edit/:tenderid/:projectid',
    component: PlanningComponent 
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule { }
