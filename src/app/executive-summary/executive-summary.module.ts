import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecutiveSummaryComponent } from './executive-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WBSComponent } from '../Tender/Components/wbs/wbs.component';
import { PaginateModule } from '../Shared/Module/paginate/paginate.module';
import { EditWbsComponent } from '../Tender/Components/wbs/edit-wbs/edit-wbs.component';
import { AddWbsComponent } from '../Tender/Components/wbs/add-wbs/add-wbs.component';
import { DndModule } from 'ngx-drag-drop';
import { WbsItemsComponent } from './components/wbs-items/wbs-items.component';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { ImportExecutiveSummaryComponent } from './components/import-executive-summary/import-executive-summary.component';
import { ChainageDetailsComponent } from './components/chainage-details/chainage-details.component';

@NgModule({
  declarations: [
    ExecutiveSummaryComponent,
    WBSComponent,
    EditWbsComponent,
    AddWbsComponent,
    WbsItemsComponent,
    ImportExecutiveSummaryComponent,
    ChainageDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginateModule,
    DndModule,
    SharedModuleModule
  ],
  exports: [
    ExecutiveSummaryComponent,
    WBSComponent,
    EditWbsComponent,
    AddWbsComponent,
    ChainageDetailsComponent
  ]
})
export class ExecutiveSummaryModule { }
