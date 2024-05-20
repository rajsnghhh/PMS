import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsComponent } from './dynamic-forms.component';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { TenderactionsComponent } from 'src/app/Tender/Components/tenderactions/tenderactions.component';
import { TabularEntryComponent } from 'src/app/Tender/Components/tabular-entry/tabular-entry.component';
import { TableViewComponent } from 'src/app/Tender/Components/table-view/table-view.component';



@NgModule({
  declarations: [
    DynamicFormsComponent,
    TenderactionsComponent,
    TabularEntryComponent,
    TableViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMultiSelectModule,
    SharedModuleModule
  ],
  exports: [
    DynamicFormsComponent
  ]
})
export class DynamicFormsModule { }
