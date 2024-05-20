import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningComponent } from './planning.component';
import { DynamicFormsModule } from '../Shared/Module/dynamic-forms/dynamic-forms.module';
import { ExecutiveSummaryModule } from '../executive-summary/executive-summary.module';
import { PlanningActionsComponent } from './components/planning-actions/planning-actions.component';
import { DelayMisComponent } from './components/delay-mis/delay-mis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicStripPlannedAchivedModule } from '../Shared/Module/dynamic-strip-planned-achived/dynamic-strip-planned-achived.module';
import { GanttModule } from '../gantt/gantt.module';
import { BoqApprovalComponent } from './components/boq-approval/boq-approval.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PlanningComponent,
    PlanningActionsComponent,
    DelayMisComponent,
    BoqApprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PlanningRoutingModule,
    DynamicFormsModule,
    ExecutiveSummaryModule,
    DynamicStripPlannedAchivedModule,
    GanttModule,
    NgSelectModule

  ]
})
export class PlanningModule { }
