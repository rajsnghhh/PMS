import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkOrderRoutingModule } from './work-order-routing.module';
import { WorkOrderTopCardComponent } from './work-order-components/work-order-top-card/work-order-top-card.component';
import { WorkOrderLastCardComponent } from './work-order-components/work-order-last-card/work-order-last-card.component';
import { WorkOrderTableCardComponent } from './work-order-components/work-order-table-card/work-order-table-card.component';
import { WorkOrderComponent } from './work-order-components/work-order/work-order.component';
import { WorkOrderListComponent } from './work-order-components/work-order-list/work-order-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { WorkOrderAdvanceSearchComponent } from './work-order-components/work-order-advance-search/work-order-advance-search.component';
import { WoGstTopCardComponent } from './work-order-gst-components/wo-gst-top-card/wo-gst-top-card.component';
import { WoGstTableCardComponent } from './work-order-gst-components/wo-gst-table-card/wo-gst-table-card.component';
import { WoGstLastCardComponent } from './work-order-gst-components/wo-gst-last-card/wo-gst-last-card.component';
import { WoGstComponent } from './work-order-gst-components/wo-gst/wo-gst.component';
import { MultiStageApprovalComponent } from './work-order-components/multi-stage-approval/multi-stage-approval.component';


@NgModule({
  declarations: [
    WorkOrderTopCardComponent,
    WorkOrderLastCardComponent,
    WorkOrderTableCardComponent,
    WorkOrderComponent,
    WorkOrderListComponent,
    WorkOrderAdvanceSearchComponent,
    WoGstTopCardComponent,
    WoGstTableCardComponent,
    WoGstLastCardComponent,
    MultiStageApprovalComponent,
    WoGstComponent
  ],
  imports: [
    CommonModule,
    WorkOrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule
  ]
})
export class WorkOrderModule { }
