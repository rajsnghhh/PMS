import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxInvoiceChallanRoutingModule } from './tax-invoice-challan-routing.module';
import { TaxInvoiceChallanListComponent } from './tax-invoice-challan-list/tax-invoice-challan-list.component';
import { TaxInvoiceChallanAddEditComponent } from './tax-invoice-challan-add-edit/tax-invoice-challan-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { IssueToTaxInvoiceComponent } from './issue-to-tax-invoice/issue-to-tax-invoice.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TaxInvoiceApprovalComponent } from './tax-invoice-approval/tax-invoice-approval.component';


@NgModule({
  declarations: [
    TaxInvoiceChallanListComponent,
    TaxInvoiceChallanAddEditComponent,
    IssueToTaxInvoiceComponent,
    TaxInvoiceApprovalComponent
  ],
  imports: [
    CommonModule,
    TaxInvoiceChallanRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSelectModule,
    NgSelectModule
  ]
})
export class TaxInvoiceChallanModule { }
