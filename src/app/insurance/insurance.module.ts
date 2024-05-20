import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { ViewInsuranceComponent } from './Components/view-insurance/view-insurance.component';
import { InsuranceComponent } from './insurance.component';


@NgModule({
  declarations: [
    ViewInsuranceComponent,
    InsuranceComponent,
  ],
  imports: [
    CommonModule,
    InsuranceRoutingModule
  ]
})
export class InsuranceModule { }
