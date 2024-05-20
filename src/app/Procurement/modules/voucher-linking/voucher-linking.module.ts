import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoucherLinkingRoutingModule } from './voucher-linking-routing.module';
import { VoucherLinkingComponent } from './components/voucher-linking/voucher-linking.component';
import { VoucherLinkingOperationComponent } from './components/voucher-linking-operation/voucher-linking-operation.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VoucherLinkingComponent,
    VoucherLinkingOperationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    VoucherLinkingRoutingModule
  ]
})
export class VoucherLinkingModule { }
