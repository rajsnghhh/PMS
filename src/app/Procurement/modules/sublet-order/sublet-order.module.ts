import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubletOrderRoutingModule } from './sublet-order-routing.module';
import { SubletOrderComponent } from './sublet-order/sublet-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SubletOrderComponent
  ],
  imports: [
    CommonModule,
    SubletOrderRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SubletOrderModule { }
