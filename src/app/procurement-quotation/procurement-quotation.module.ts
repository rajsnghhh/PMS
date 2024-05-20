import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcurementQuotationRoutingModule } from './procurement-quotation-routing.module';
import { QuotationComponent } from './quotation/quotation.component';
import { FormsModule } from '@angular/forms';
import { QuotationTopCardComponent } from './quotation-top-card/quotation-top-card.component';
import { QuotationTableComponent } from './quotation-table/quotation-table.component';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { QuotationGstTableComponent } from './quotation-gst-table/quotation-gst-table.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    QuotationComponent,
    QuotationTopCardComponent,
    QuotationTableComponent,
    QuotationGstTableComponent
  ],
  imports: [
    CommonModule,
    ProcurementQuotationRoutingModule,
    FormsModule,
    NgSelectModule,
    SharedModuleModule
  ]

})
export class ProcurementQuotationModule { }
