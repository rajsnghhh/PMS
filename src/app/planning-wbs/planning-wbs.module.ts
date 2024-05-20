import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningWbsRoutingModule } from './planning-wbs-routing.module';
import { PlanningContractualComponent } from './components/planning-contractual/planning-contractual.component';
import { RiskDetailsComponent } from './components/risk-details/risk-details.component';
import { OpportunityDetailsComponent } from './components/opportunity-details/opportunity-details.component';
import { ModifyStripComponent } from './components/modify-strip/modify-strip.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlanningContractualComponent,
    RiskDetailsComponent,
    OpportunityDetailsComponent,
    ModifyStripComponent,
    
  ],
  imports: [
    CommonModule,
    PlanningWbsRoutingModule,
    AngularMultiSelectModule,
    SharedModuleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ModifyStripComponent]
})
export class PlanningWbsModule { }
