import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnquiryRoutingModule } from './enquiry-routing.module';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SendEnquiryComponent } from './send-enquiry/send-enquiry.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';


@NgModule({
  declarations: [
    AddEnquiryComponent,
    EnquiryListComponent,
    SendEnquiryComponent
  ],
  imports: [
    CommonModule,
    EnquiryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularMultiSelectModule,
    PDFExportModule
  ]
})
export class EnquiryModule { }
