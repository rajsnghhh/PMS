import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTabularBudgetDataComponent } from './components/add-tabular-budget-data/add-tabular-budget-data.component';
import { ManageTabularBudgetDataComponent } from './components/manage-tabular-budget-data/manage-tabular-budget-data.component';
import { MaterialBudgetComponent } from './components/material-budget/material-budget.component';
import { ActivityBudgetComponent } from './components/activity-budget/activity-budget.component';
import { DropdownWiseBudgetComponent } from './components/activity-budget/dropdown-wise-budget/dropdown-wise-budget.component';

const routes: Routes = [
  {
    path: '',
    component: AddTabularBudgetDataComponent
  },
  {
    path: 'manage',
    component: ManageTabularBudgetDataComponent
  },
  {
    path: 'material-budget',
    component: MaterialBudgetComponent
  },
  {
    path: 'activity-budget',
    component: ActivityBudgetComponent
  },
  {
    path: 'items',
    component: DropdownWiseBudgetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetAccountsRoutingModule { }
