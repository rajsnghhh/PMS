import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'mr',
    loadChildren: () => import('../modules/material-requisition/material-requisition.module').then(m => m.MaterialRequisitionModule)
  },
  {
    path: 'material-issue',
    loadChildren: () => import('../modules/material-issue/material-issue.module').then(m => m.MaterialIssueModule)
  },
  {
    path: 'indent',
    loadChildren: () => import('../modules/indent/indent.module').then(m => m.IndentModule)
  },
  {
    path: 'quotation',
    loadChildren: () => import('../modules/quotations/quotations.module').then(m => m.QuotationsModule)
  },
  {
    path: 'purchase-order',
    loadChildren: () => import('../modules/purchase/purchase.module').then(m => m.PurchaseModule)
  },
  {
    path: 'grn',
    loadChildren: () => import('../modules/good-receipt-note/good-receipt-note.module').then(m => m.GoodReceiptNoteModule)
  },
  {
    path: 'work-order',
    loadChildren: () => import('../modules/work-order/work-order.module').then(m => m.WorkOrderModule)
  },

  {
    path: 'voucher-linking',
    loadChildren: () => import('../modules/voucher-linking/voucher-linking.module').then(m => m.VoucherLinkingModule)
  },
  {
    path: 'gate-pass',
    loadChildren: () => import('../modules/gate-pass/gate-pass.module').then(m => m.GatePassModule)
  },
  {
    path: 'fabrication-work',
    loadChildren: () => import('../modules/fabrication-work/fabrication-work.module').then(m => m.FabricationWorkModule)
  },
  {
    path: 'sublet-order',
    loadChildren: () => import('../modules/sublet-order/sublet-order.module').then(m => m.SubletOrderModule)
  },
  {
    path: 'party-bill-receive',
    loadChildren: () => import('../modules/party-bill-receive/party-bill-receive.module').then(m => m.PartyBillReceiveModule)
  },
  {
    path: 'enquiry',
    loadChildren: () => import('../modules/enquiry/enquiry.module').then(m => m.EnquiryModule)
  },
  {
    path: 'raw-material-sales',
    loadChildren: () => import('../modules/raw-material-sales/raw-material-sales.module').then(m => m.RawMaterialSalesModule)
  },  
  {
    path: 'way-bill',
    loadChildren: () => import('../modules/way-bill/way-bill.module').then(m => m.WayBillModule)
  },
  {
    path: 'general-administration-expenses',
    loadChildren: () => import('../modules/general-administration-expenses/general-administration-expenses.module').then(m => m.GeneralAdministrationExpensesModule)
  },
  {
    path: 'debit-note',
    loadChildren: () => import('../modules/debit-note/debit-note.module').then(m => m.DebitNoteModule)
  },

  {
    path: 'work-indent',
    loadChildren: () => import('../modules/work-indent/work-indent.module').then(m => m.WorkIndentModule)
  },

  {
    path: 'purchase',
    loadChildren: () => import('../modules/purchase-purchase/purchase-purchase.module').then(m => m.PurchasePurchaseModule)
  },
  {
    path: 'purchase-return',
    loadChildren: () => import('../modules/purchase-return/purchase-return.module').then(m => m.PurchaseReturnModule)
  },
  {
    path: 'tax-invoice-challan',
    loadChildren: () => import('../modules/tax-invoice-challan/tax-invoice-challan.module').then(m => m.TaxInvoiceChallanModule)
  },
  {
    path: 'transport-bill',
    loadChildren: () => import('../modules/transport-bill/transport-bill.module').then(m => m.TransportBillModule)
  },
  {
    path: 'plant-prod',
    loadChildren: () => import('../modules/plant-and-production/plant-and-production.module').then(m => m.PlantAndProductionModule)
  },
  {
    path: 'report',
    loadChildren: () => import('../modules/report/report.module').then(m => m.ReportModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcurementMainRoutingModule { }
