import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseReturnRoutingModule } from './purchase-return-routing.module';
import { PaginateModule } from 'src/app/Shared/Module/paginate/paginate.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { PurchaseTopComponent } from './components/purchase-top/purchase-top.component';
import { PurchaseBelowTableComponent } from './components/purchase-below-table/purchase-below-table.component';
import { PurchaseTableComponent } from './components/purchase-table/purchase-table.component';
import { PurchaseGstTableComponent } from './components/purchase-gst-table/purchase-gst-table.component';


@NgModule({
  declarations: [
    PurchaseListComponent,
    PurchaseComponent,
    PurchaseTopComponent,
    PurchaseBelowTableComponent,
    PurchaseTableComponent,
    PurchaseGstTableComponent
  ],
  imports: [
    CommonModule,
    PaginateModule,
    FormsModule,
    NgSelectModule,
    SharedModuleModule,
    CommonModule,
    PurchaseReturnRoutingModule
  ]
})
export class PurchaseReturnModule { }
