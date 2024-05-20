import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationComponent } from './quotation/quotation.component';

const routes: Routes = [
  { 
    // without GST ==========
    path: 'tax/:maildata', 
    component: QuotationComponent 
  },
  { 
    // with GST =============
    path: 'gst/:maildata', 
    component: QuotationComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcurementQuotationRoutingModule { }
