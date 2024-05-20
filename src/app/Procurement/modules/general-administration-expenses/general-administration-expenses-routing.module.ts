import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralAdministrationExpensesComponent } from './general-administration-expenses/general-administration-expenses.component';
import { AddUpdateGeneralAdministrationExpensesComponent } from './add-update-general-administration-expenses/add-update-general-administration-expenses.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddUpdateGeneralAdministrationExpensesComponent
  },
  {
    path: 'list',
    component: GeneralAdministrationExpensesComponent
  },
  {
    path: 'edit/:id',
    component: AddUpdateGeneralAdministrationExpensesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralAdministrationExpensesRoutingModule { }
