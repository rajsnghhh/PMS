import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemOpeningComponent } from './components/item-opening/item-opening.component';
import { MaterialPhysicalStockComponent } from './components/material-physical-stock/material-physical-stock.component';
import { PhysicalStockListComponent } from './components/material-physical-stock/physical-stock-list/physical-stock-list.component';
import { PhysicalStockPostComponent } from './components/material-physical-stock/physical-stock-post/physical-stock-post.component';
import { MaterialWastageComponent } from './components/material-wastage/material-wastage.component';
import { GroupTaskComponent } from './components/group-task/group-task.component';
import { ItemStockJvComponent } from './components/item-stock-jv/item-stock-jv.component';
import { SingleLogBookComponent } from './components/single-log-book/single-log-book.component';
import { LabReportEntryComponent } from './components/lab-report-entry/lab-report-entry.component';
import { MaterialIssueReturnComponent } from './components/material-issue-return/material-issue-return.component';

const routes: Routes = [
  {
    path: 'item-opening',
    component: ItemOpeningComponent
  },
  {
    path: 'item-opening-add',
    component: ItemOpeningComponent
  },
  {
    path: 'physical-stock',
    component: MaterialPhysicalStockComponent
  },
  {
    path: 'physical-stock-post',
    component: PhysicalStockPostComponent
  },
  {
    path: 'physical-stock-list',
    component: PhysicalStockListComponent
  },
  {
    path: 'material-wastage',
    component: MaterialWastageComponent
  },
  {
    path: 'material-wastage/add',
    component: MaterialWastageComponent
  },
  {
    path: 'group-task',
    component: GroupTaskComponent
  },
  {
    path: 'group-task/add',
    component: GroupTaskComponent
  },
  {
    path: 'item-stock-jv',
    component: ItemStockJvComponent
  },
  {
    path: 'item-stock-jv/add',
    component: ItemStockJvComponent
  },
  {
    path: 'single-log-book-machine',
    component: SingleLogBookComponent
  },
  {
    path: 'single-log-book-machine/add',
    component: SingleLogBookComponent
  },
  {
    path: 'lab-report-entry',
    component: LabReportEntryComponent
  },
  {
    path: 'lab-report-entry/add',
    component: LabReportEntryComponent
  },
  {
    path: 'material-issue-return',
    component: MaterialIssueReturnComponent
  },
  {
    path: 'material-issue-return/add',
    component: MaterialIssueReturnComponent
  },
  {
    path: 'material-issue-return/:issueIds',
    component: MaterialIssueReturnComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
