import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from 'src/app/Shared/Guard/auth-guard.guard';
import { WorkOrderComponent } from './work-order-components/work-order/work-order.component';
import { WorkOrderAdvanceSearchComponent } from './work-order-components/work-order-advance-search/work-order-advance-search.component';
import { WoGstComponent } from './work-order-gst-components/wo-gst/wo-gst.component';
import { MultiStageApprovalComponent } from './work-order-components/multi-stage-approval/multi-stage-approval.component';

const routes: Routes = [
  { path: '', component: WorkOrderAdvanceSearchComponent },
  {
    path: 'create',
    // canActivate: [AuthGuardGuard],
    // data: { url: ['Store-GRN'] },
    component: WorkOrderComponent,
    pathMatch: 'full'
  },
  {
    path: 'GST/create',
    // canActivate: [AuthGuardGuard],
    // data: { url: ['Store-GRN'] },
    component: WoGstComponent,
    pathMatch: 'full'
  },
  {
    path: 'multistage-approval',
    component: MultiStageApprovalComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderRoutingModule { }
