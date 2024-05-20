import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportBillRoutingModule } from './transport-bill-routing.module';
import { TransportBillListComponent } from './transport-bill-list/transport-bill-list.component';
import { TransportBillAddComponent } from './transport-bill-add/transport-bill-add.component';
import { TransportBillApproveComponent } from './transport-bill-approve/transport-bill-approve.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { TransportBillFormComponent } from './transport-bill-form/transport-bill-form.component';


@NgModule({
  declarations: [
    TransportBillListComponent,
    TransportBillAddComponent,
    TransportBillApproveComponent,
    TransportBillFormComponent
  ],
  imports: [
    CommonModule,
    TransportBillRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSelectModule,
    NgSelectModule
  ]
})
export class TransportBillModule { }
