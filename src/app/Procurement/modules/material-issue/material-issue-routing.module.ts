import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialIssueComponent } from './components/material-issue/material-issue.component';
import { IssueAdvancedSearchComponent } from './components/issue-advanced-search/issue-advanced-search.component';
import { MultiIssueComponent } from './components/multi-issue/multi-issue.component';
import { BulkTransferComponent } from './components/bulk-transfer/bulk-transfer.component';
import { AcknowledgementApprovalComponent } from './components/acknowledgement-approval/acknowledgement-approval.component';

const routes: Routes = [
  {
    path: '',
    component: IssueAdvancedSearchComponent
  },
  {
    path: 'import',
    component: IssueAdvancedSearchComponent
  },
  {
    path: 'request',
    component: MaterialIssueComponent
  },
  {
    path: 'request/:mrIds',
    component: MaterialIssueComponent
  },
  {
    path: 'multi-request',
    component: MultiIssueComponent
  },
  {
    path: 'bulk-transfer',
    component: BulkTransferComponent
  },
  {
    path: 'ackowledgement',
    component: AcknowledgementApprovalComponent
  },
  {
    path: 'ackowledgement-approval',
    component: AcknowledgementApprovalComponent
  },
  {
    path: 'request/view/:issueId',
    component: MaterialIssueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialIssueRoutingModule { }
