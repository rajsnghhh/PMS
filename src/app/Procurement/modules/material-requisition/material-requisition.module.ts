import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRequisitionRoutingModule } from './material-requisition-routing.module';
import { CreateMrComponent } from './components/create-mr/create-mr.component';
import { CreateMrTableComponent } from './components/create-mr-table/create-mr-table.component';
import { FormBelowCreateMrTableComponent } from './components/form-below-create-mr-table/form-below-create-mr-table.component';
import { SendSmsEmailCreateMrComponent } from './components/send-sms-email-create-mr/send-sms-email-create-mr.component';
import { MrListComponent } from './components/mr-list/mr-list.component';
import { MrAdvancedSearchComponent } from './components/mr-advanced-search/mr-advanced-search.component';
import { MrTopCardComponent } from './components/mr-top-card/mr-top-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPrintModule } from 'ngx-print';
import { MRPrintComponent } from './components/mr-print/mr-print.component';
import { MrUpdateStatusComponent } from './components/mr-update-status/mr-update-status.component';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { CheckComponent } from './components/check/check.component';
import { PaginateModule } from 'src/app/Shared/Module/paginate/paginate.module';

@NgModule({
  declarations: [
    CreateMrComponent,
    CreateMrTableComponent,
    FormBelowCreateMrTableComponent,
    SendSmsEmailCreateMrComponent,
    MrListComponent,
    MrAdvancedSearchComponent,
    MrTopCardComponent,
    MRPrintComponent,
    MrUpdateStatusComponent,
    CheckComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MaterialRequisitionRoutingModule,
    NgxPrintModule,
    SharedModuleModule,
    PaginateModule
  ]
})
export class MaterialRequisitionModule { }
