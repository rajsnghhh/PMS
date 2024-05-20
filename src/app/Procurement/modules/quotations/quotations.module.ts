import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationsRoutingModule } from './quotations-routing.module';
import { QuotationsComponent } from './quotations.component';
import { ProcurementQuotationModule } from 'src/app/procurement-quotation/procurement-quotation.module';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';


@NgModule({
  declarations: [
    QuotationsComponent
  ],
  imports: [
    CommonModule,
    QuotationsRoutingModule, 
    ProcurementQuotationModule,
    SharedModuleModule,
    FormsModule,
    PDFExportModule
  ]
})
export class QuotationsModule { }
