import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WayBillRoutingModule } from './way-bill-routing.module';
import { WayBillComponent } from './components/way-bill/way-bill.component';
import { WayBillTopCardComponent } from './components/way-bill/way-bill-top-card/way-bill-top-card.component';
import { WayBillTableDataComponent } from './components/way-bill/way-bill-table-data/way-bill-table-data.component';
import { WayBillBottomCardComponent } from './components/way-bill/way-bill-bottom-card/way-bill-bottom-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { WayBillAdvancedSearchComponent } from './components/way-bill-advanced-search/way-bill-advanced-search.component';
import { WayBillListComponent } from './components/way-bill-list/way-bill-list.component';
import { WayBillLinkingComponent } from './components/way-bill-linking/way-bill-linking.component';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';


@NgModule({
  declarations: [
    WayBillComponent,
    WayBillTopCardComponent,
    WayBillTableDataComponent,
    WayBillBottomCardComponent,
    WayBillAdvancedSearchComponent,
    WayBillListComponent,
    WayBillLinkingComponent
  ],
  imports: [
    CommonModule,
    WayBillRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModuleModule
  ]
})
export class WayBillModule { }
