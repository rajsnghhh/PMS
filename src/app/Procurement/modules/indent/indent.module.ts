import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndentRoutingModule } from './indent-routing.module';
import { IndentListComponent } from './components/indent-list/indent-list.component';
import { IndentRequestComponent } from './components/indent-request/indent-request.component';
import { IndentAdvancedSearchComponent } from './components/indent-advanced-search/indent-advanced-search.component';
import { IndentRequestFormTableComponent } from './components/indent-request-form-table/indent-request-form-table.component';
import { IndentRequestFormDataComponent } from './components/indent-request-form-data/indent-request-form-data.component';
import { SendSmsEmailIndentComponent } from './components/send-sms-email-indent/send-sms-email-indent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndentTopCardComponent } from './components/indent-top-card/indent-top-card.component';
import { IndentApproverComponent } from './components/indent-approver/indent-approver.component';
import { NgxPrintModule } from 'ngx-print';
import { IndentPrintComponent } from './components/indent-print/indent-print.component';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { MultiStageApprovalComponent } from './components/multi-stage-approval/multi-stage-approval.component';
import { CheckIndentComponent } from './components/check-indent/check-indent.component';
import { IndentUpdateStatusComponent } from './components/indent-update-status/indent-update-status.component';
import { PaginateModule } from 'src/app/Shared/Module/paginate/paginate.module';


@NgModule({
  declarations: [
    IndentListComponent,
    IndentRequestComponent,
    IndentAdvancedSearchComponent,
    IndentRequestFormTableComponent,
    IndentRequestFormDataComponent,
    SendSmsEmailIndentComponent,
    IndentTopCardComponent,
    IndentApproverComponent,
    IndentPrintComponent,
    MultiStageApprovalComponent,
    CheckIndentComponent,
    IndentUpdateStatusComponent
  ],
  imports: [
    CommonModule,
    IndentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule,
    SharedModuleModule,
    PaginateModule
  ]
})
export class IndentModule { }
