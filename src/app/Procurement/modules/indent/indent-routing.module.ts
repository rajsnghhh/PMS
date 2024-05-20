import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndentListComponent } from './components/indent-list/indent-list.component';
import { IndentRequestComponent } from './components/indent-request/indent-request.component';
import { IndentAdvancedSearchComponent } from './components/indent-advanced-search/indent-advanced-search.component';
import { IndentPrintComponent } from './components/indent-print/indent-print.component';
import { MultiStageApprovalComponent } from './components/multi-stage-approval/multi-stage-approval.component';
import { CheckIndentComponent } from './components/check-indent/check-indent.component';
import { IndentUpdateStatusComponent } from './components/indent-update-status/indent-update-status.component';

const routes: Routes = [
  {
    path: '',
    component: IndentAdvancedSearchComponent
  },
  {
    path: 'through',
    component: IndentAdvancedSearchComponent
  },
  {
    path: 'request',
    component: IndentRequestComponent
  },
  {
    path: 'request/:mrIds',
    component: IndentRequestComponent
  },
  {
    path: 'create',
    component: IndentRequestComponent
  },
  {
    path: 'request/modify/:indentId',
    component: IndentRequestComponent
  },
  {
    path: 'request/view/:indentId',
    component: IndentRequestComponent
  },
  {
    path: 'request/print/:indentId',
    component: IndentPrintComponent
  },
  {
    path: 'multistage-approval',
    component: MultiStageApprovalComponent
  },
  {
    path: 'request/checkStatus/:indentId',
    component: CheckIndentComponent
  },
  {
    path: 'request/updateStatus/:indentId',
    component: IndentUpdateStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndentRoutingModule { }
