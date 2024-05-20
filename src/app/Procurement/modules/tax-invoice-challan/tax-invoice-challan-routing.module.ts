import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxInvoiceChallanListComponent } from './tax-invoice-challan-list/tax-invoice-challan-list.component';
import { TaxInvoiceChallanAddEditComponent } from './tax-invoice-challan-add-edit/tax-invoice-challan-add-edit.component';
import { IssueToTaxInvoiceComponent } from './issue-to-tax-invoice/issue-to-tax-invoice.component';
import { TaxInvoiceApprovalComponent } from './tax-invoice-approval/tax-invoice-approval.component';

const routes: Routes = [
  {
    path: '',
    component:TaxInvoiceChallanListComponent
  },
  {
    path: 'list',
    component:TaxInvoiceChallanListComponent
  },
  {
    path: 'create',
    component: TaxInvoiceChallanAddEditComponent
  },
  {
    path: 'approve',
    component: TaxInvoiceApprovalComponent
  },
  {
    path: 'request/:issueIds',
    component: IssueToTaxInvoiceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxInvoiceChallanRoutingModule { }
