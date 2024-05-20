import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementMainRoutingModule } from './procurement-main-routing.module';
import { RouterModule } from '@angular/router';
// import { ProcurementMainComponent } from './procurement-main.component';


@NgModule({
  declarations: [
    // ProcurementMainComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProcurementMainRoutingModule
  ]
})
export class ProcurementMainModule { }
