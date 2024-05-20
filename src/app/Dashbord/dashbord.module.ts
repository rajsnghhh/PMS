import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashbordRoutingModule } from './dashbord-routing.module';
import { DashbordMainComponent } from './dashbord-main.component';
import { DashbordFirstFoldComponent } from './dashbord-first-fold/dashbord-first-fold.component';
import { DashbordSecondFoldComponent } from './dashbord-second-fold/dashbord-second-fold.component';
import { DashbordThirdFoldComponent } from './dashbord-third-fold/dashbord-third-fold.component';


@NgModule({
  declarations: [
    DashbordMainComponent,
    DashbordFirstFoldComponent,
    DashbordSecondFoldComponent,
    DashbordThirdFoldComponent
  ],
  imports: [
    CommonModule,
    DashbordRoutingModule
  ]
})
export class DashbordModule { }
