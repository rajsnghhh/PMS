import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrnComponent } from './grn/grn.component';
import { GrnAdvanceSearchComponent } from './grn-advance-search/grn-advance-search.component';
import { GrnPrintComponent } from './grn-print/grn-print.component';
import { AuthGuardGuard } from 'src/app/Shared/Guard/auth-guard.guard';
import { MultipleGrnComponent } from './multiple-grn/multiple-grn.component';

const routes: Routes = [
  {
    path: '',
    component: GrnAdvanceSearchComponent
  },
  {
    path: 'through',
    component: GrnAdvanceSearchComponent
  },
  {
    path: 'import',
    component: GrnAdvanceSearchComponent
  },
  {
    path: 'create',
    component: GrnComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-gst',
    component: GrnComponent,
    pathMatch: 'full'
  },
  {
    path: 'create/po/:poId',
    component: GrnComponent
  },
  {
    path: 'create/indent/:indentId',
    component: GrnComponent
  },
  {
    path: 'create/indent-gst/:indentId',
    component: GrnComponent
  },
  // {
  //   path: 'create/mr/:mrId',
  //   component: GrnComponent
  // },
  // MR TO Grn Removed As Discussed with Management
  {
    path: 'modify/:grnId',
    component: GrnComponent
  },
  {
    path: 'view/:grnId',
    component: GrnComponent
  },
  {
    path: 'print/:grnId',
    component: GrnPrintComponent
  },
  {
    path: 'multiple-add',
    component: MultipleGrnComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodReceiptNoteRoutingModule { }
