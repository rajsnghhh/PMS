import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralAdministrationExpensesRoutingModule } from './general-administration-expenses-routing.module';
import { GeneralAdministrationExpensesComponent } from './general-administration-expenses/general-administration-expenses.component';
import { AddUpdateGeneralAdministrationExpensesComponent } from './add-update-general-administration-expenses/add-update-general-administration-expenses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    GeneralAdministrationExpensesComponent,
    AddUpdateGeneralAdministrationExpensesComponent
  ],
  imports: [
    CommonModule,
    GeneralAdministrationExpensesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class GeneralAdministrationExpensesModule { }
