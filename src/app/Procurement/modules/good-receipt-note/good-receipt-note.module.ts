import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodReceiptNoteRoutingModule } from './good-receipt-note-routing.module';
import { GrnComponent } from './grn/grn.component';
import { GrnTopCardComponent } from './grn-top-card/grn-top-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrnTableDataComponent } from './grn-table-data/grn-table-data.component';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { GrnAdvanceSearchComponent } from './grn-advance-search/grn-advance-search.component';
import { GrnListComponent } from './grn-list/grn-list.component';
import { GrnPrintComponent } from './grn-print/grn-print.component';
import { MultipleGrnComponent } from './multiple-grn/multiple-grn.component';
import { GrnApproverComponent } from './grn-approver/grn-approver.component';
import { ImportGrnComponent } from './import-grn/import-grn.component';
import { GrnCheckComponent } from './grn-check/grn-check.component';
import { GrnItemTableComponent } from './grn-item-table/grn-item-table.component';
import { GrnGstItemTableComponent } from './grn-gst-item-table/grn-gst-item-table.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPrintModule } from 'ngx-print';
import { PaginateModule } from 'src/app/Shared/Module/paginate/paginate.module';


@NgModule({
  declarations: [
    GrnComponent,
    GrnTopCardComponent,
    GrnTableDataComponent,
    GrnAdvanceSearchComponent,
    GrnListComponent,
    GrnPrintComponent,
    MultipleGrnComponent,
    GrnApproverComponent,
    ImportGrnComponent,
    GrnCheckComponent,
    GrnItemTableComponent,
    GrnGstItemTableComponent,
  ],
  imports: [
    CommonModule,
    GoodReceiptNoteRoutingModule,
    FormsModule,
    NgSelectModule,
    SharedModuleModule,
    ReactiveFormsModule,
    NgxPrintModule,
    PaginateModule
  ]
})
export class GoodReceiptNoteModule { }
