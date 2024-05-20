import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from '../budget/budget.component';
import { BidgetDetailsComponent } from './components/bidget-details/bidget-details.component';
import { PaginateModule } from '../Shared/Module/paginate/paginate.module';
import { BudgetBoqComponent } from './components/budget-boq/budget-boq.component';
import { LmpiBoqModule } from '../lmpi-boq/lmpi-boq.module';
import { FormsModule } from '@angular/forms';
import { BudgetLmpiComponent } from './components/budget-lmpi/budget-lmpi.component';
import { ViewBudgetComponent } from './components/view-budget/view-budget.component';
import { BoqApproverComponent } from './components/boq-approver/boq-approver.component';
import { ViewBudgetDetailsComponent } from './components/view-budget-details/view-budget-details.component';
import { GanttModule } from '../gantt/gantt.module';


@NgModule({
  declarations: [
    BudgetComponent,
    BidgetDetailsComponent,
    BudgetBoqComponent,
    BudgetLmpiComponent,
    ViewBudgetComponent,
    BoqApproverComponent,
    ViewBudgetDetailsComponent
  ],
  imports: [
    CommonModule,
    BudgetRoutingModule,
    PaginateModule,
    LmpiBoqModule,
    FormsModule,
    GanttModule
  ]
})
export class BudgetModule { }
