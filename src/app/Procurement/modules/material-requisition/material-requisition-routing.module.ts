import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMrComponent } from './components/create-mr/create-mr.component';
import { MrAdvancedSearchComponent } from './components/mr-advanced-search/mr-advanced-search.component';
import { MRPrintComponent } from './components/mr-print/mr-print.component';
import { MrUpdateStatusComponent } from './components/mr-update-status/mr-update-status.component';
import { CheckComponent } from './components/check/check.component';

const routes: Routes = [
  {
    path: '',
    component: MrAdvancedSearchComponent,
  },
  {
    path: 'create',
    component: CreateMrComponent
  },
  {
    path: 'modify/:mrId',
    component: CreateMrComponent
  },
  {
    path: 'view/:mrId',
    component: CreateMrComponent
  },
  {
    path: 'print/:mrId',
    component: MRPrintComponent
  },
  {
    path: 'updateStatus/:mrId',
    component: MrUpdateStatusComponent
  },
  {
    path: 'checkStatus/:mrId',
    component: CheckComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRequisitionRoutingModule { }
