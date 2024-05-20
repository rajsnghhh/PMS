import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasePurchaseRoutingModule } from './purchase-purchase-routing.module';
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { PaginateModule } from 'src/app/Shared/Module/paginate/paginate.module';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { PurchaseTopComponent } from './components/purchase-top/purchase-top.component';
import { PurchaseBelowTableComponent } from './components/purchase-below-table/purchase-below-table.component';
import { PurchaseTableComponent } from './components/purchase-table/purchase-table.component';
import { PurchaseGstTableComponent } from './components/purchase-gst-table/purchase-gst-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { GrnCancelCloseComponent } from './components/grn-cancel-close/grn-cancel-close.component';
import { PurchaseApprovalComponent } from './components/purchase-approval/purchase-approval.component';
import { PurchaseCheckComponent } from './components/purchase-check/purchase-check.component';
import { PurchaseRejectComponent } from './components/purchase-reject/purchase-reject.component';
import { PurchaseCancelCloseComponent } from './components/purchase-cancel-close/purchase-cancel-close.component';


@NgModule({
  declarations: [
    PurchaseListComponent,
    PurchaseComponent,
    PurchaseTopComponent,
    PurchaseBelowTableComponent,
    PurchaseTableComponent,
    PurchaseGstTableComponent,
    GrnCancelCloseComponent,
    PurchaseApprovalComponent,
    PurchaseCheckComponent,
    PurchaseRejectComponent,
    PurchaseCancelCloseComponent
  ],
  imports: [
    CommonModule,
    PaginateModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModuleModule,
    PurchasePurchaseRoutingModule
  ]
})
export class PurchasePurchaseModule { }
