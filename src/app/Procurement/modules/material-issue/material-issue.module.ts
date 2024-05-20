import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialIssueRoutingModule } from './material-issue-routing.module';
import { MaterialIssueComponent } from './components/material-issue/material-issue.component';
import { FormTableBelowMaterialIssueComponent } from './components/form-table-below-material-issue/form-table-below-material-issue.component';
import { FormDataBelowMaterialIssueComponent } from './components/form-data-below-material-issue/form-data-below-material-issue.component';
import { MaterialIssueTopCardComponent } from './components/material-issue-top-card/material-issue-top-card.component';
import { IssueAdvancedSearchComponent } from './components/issue-advanced-search/issue-advanced-search.component';
import { IssueListComponent } from './components/issue-list/issue-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultiIssueComponent } from './components/multi-issue/multi-issue.component';
import { ImportIssueComponent } from './components/import-issue/import-issue.component';
import { BulkTransferComponent } from './components/bulk-transfer/bulk-transfer.component';
import { AcknowledgementApprovalComponent } from './components/acknowledgement-approval/acknowledgement-approval.component';


@NgModule({
  declarations: [
    MaterialIssueComponent,
    FormTableBelowMaterialIssueComponent,
    FormDataBelowMaterialIssueComponent,
    MaterialIssueTopCardComponent,
    IssueAdvancedSearchComponent,
    IssueListComponent,
    MultiIssueComponent,
    ImportIssueComponent,
    BulkTransferComponent,
    AcknowledgementApprovalComponent,
  ],
  imports: [
    CommonModule,
    MaterialIssueRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModuleModule,
    NgSelectModule
  ]
})
export class MaterialIssueModule { }
