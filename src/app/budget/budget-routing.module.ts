import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { ViewBudgetDetailsComponent } from './components/view-budget-details/view-budget-details.component';

const routes: Routes = [
  { 
    path: 'view/:tenderid/:projectid',
    component: BudgetComponent 
  },
  // { 
  //   path: 'edit/:tenderid/:projectid',
  //   component: BudgetComponent 
  // }
  {
    path : 'boq/:boqID',
    component : ViewBudgetDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
