import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationsComponent } from './quotations.component';
import { QuotationComponent } from 'src/app/procurement-quotation/quotation/quotation.component';


const routes: Routes = [
  {
    path: 'compare/:indentId',  // Indent => Quotyation replaces by Enquery => Quotation 
    component: QuotationsComponent 
  },

  {
    path: 'view/:quotationId',
    component: QuotationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationsRoutingModule { }
