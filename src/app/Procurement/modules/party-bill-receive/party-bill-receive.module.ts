import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyBillReceiveRoutingModule } from './party-bill-receive-routing.module';
import { PartyBillListComponent } from './party-bill-list/party-bill-list.component';
import { PartyBillAddeditComponent } from './party-bill-addedit/party-bill-addedit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PartyBillAcceptComponent } from './party-bill-accept/party-bill-accept.component';


@NgModule({
  declarations: [
    PartyBillListComponent,
    PartyBillAddeditComponent,
    PartyBillAcceptComponent
  ],
  imports: [
    CommonModule,
    PartyBillReceiveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class PartyBillReceiveModule { }
