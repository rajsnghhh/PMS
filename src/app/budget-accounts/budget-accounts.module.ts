import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetAccountsRoutingModule } from './budget-accounts-routing.module';
import { AddTabularBudgetDataComponent } from './components/add-tabular-budget-data/add-tabular-budget-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotTableModule } from '@handsontable/angular';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { ManageTabularBudgetDataComponent } from './components/manage-tabular-budget-data/manage-tabular-budget-data.component';
import { MaterialBudgetComponent } from './components/material-budget/material-budget.component';
import { ActivityBudgetComponent } from './components/activity-budget/activity-budget.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EntryActivityBudgetComponent } from './components/activity-budget/entry-activity-budget/entry-activity-budget.component';
import { BudgetSummaryComponent } from './components/activity-budget/budget-summary/budget-summary.component';
import { DropdownWiseBudgetComponent } from './components/activity-budget/dropdown-wise-budget/dropdown-wise-budget.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [
    AddTabularBudgetDataComponent,
    ManageTabularBudgetDataComponent,
    MaterialBudgetComponent,
    ActivityBudgetComponent,
    EntryActivityBudgetComponent,
    BudgetSummaryComponent,
    DropdownWiseBudgetComponent
  ],
  imports: [
    CommonModule,
    BudgetAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule,
    HotTableModule.forRoot(),
    NgSelectModule,
    AngularMultiSelectModule
  ]
})
export class BudgetAccountsModule { }
