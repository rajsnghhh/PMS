import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { ItemOpeningComponent } from './components/item-opening/item-opening.component';
import { MaterialIssueComponent } from './components/material-issue/material-issue.component';
import { MaterialWastageComponent } from './components/material-wastage/material-wastage.component';
import { MaterialIssueReturnComponent } from './components/material-issue-return/material-issue-return.component';
import { PaginateModule } from 'src/app/Shared/Module/paginate/paginate.module';
import { ItemAddEditComponent } from './components/item-opening/item-add-edit/item-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { MaterialPhysicalStockComponent } from './components/material-physical-stock/material-physical-stock.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { PhysicalStockListComponent } from './components/material-physical-stock/physical-stock-list/physical-stock-list.component';
import { PhysicalStockPostComponent } from './components/material-physical-stock/physical-stock-post/physical-stock-post.component';
import { AddUpdateMaterialWastageComponent } from './components/material-wastage/add-update-material-wastage/add-update-material-wastage.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupTaskComponent } from './components/group-task/group-task.component';
import { AddUpdateGroupTaskComponent } from './components/group-task/add-update-group-task/add-update-group-task.component';
import { ItemStockJvComponent } from './components/item-stock-jv/item-stock-jv.component';
import { AddUpdateItemStockJvComponent } from './components/item-stock-jv/add-update-item-stock-jv/add-update-item-stock-jv.component';
import { SingleLogBookComponent } from './components/single-log-book/single-log-book.component';
import { AddUpdateSingleLogBookComponent } from './components/single-log-book/add-update-single-log-book/add-update-single-log-book.component';
import { LabReportEntryComponent } from './components/lab-report-entry/lab-report-entry.component';
import { AddUpdateLabReportEntryComponent } from './components/lab-report-entry/add-update-lab-report-entry/add-update-lab-report-entry.component';
import { AddUpdateMaterialIssueReturnComponent } from './components/material-issue-return/add-update-material-issue-return/add-update-material-issue-return.component';



@NgModule({
  declarations: [
    ItemOpeningComponent,
    MaterialIssueComponent,
    MaterialWastageComponent,
    MaterialIssueReturnComponent,
    ItemAddEditComponent,
    MaterialPhysicalStockComponent,
    PhysicalStockListComponent,
    PhysicalStockPostComponent,
    AddUpdateMaterialWastageComponent,
    GroupTaskComponent,
    AddUpdateGroupTaskComponent,
    ItemStockJvComponent,
    AddUpdateItemStockJvComponent,
    SingleLogBookComponent,
    AddUpdateSingleLogBookComponent,
    LabReportEntryComponent,
    AddUpdateLabReportEntryComponent,
    AddUpdateMaterialIssueReturnComponent,
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    PaginateModule,
    FormsModule,
    SharedModuleModule,
    ReactiveFormsModule,
    SharedModuleModule,
    AngularMultiSelectModule,
    NgSelectModule,
  ]
})
export class StoreModule { }
