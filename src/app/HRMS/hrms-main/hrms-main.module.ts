import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmsMainRoutingModule } from './hrms-main-routing.module';
import { HrmsMainComponent } from './hrms-main.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HrmsHeaderComponent } from '../shared/hrms-header/hrms-header.component';
import { HrmsNavPositionComponent } from '../shared/hrms-nav-position/hrms-nav-position.component';


@NgModule({
  declarations: [
    HrmsMainComponent,
    HrmsHeaderComponent,
    HrmsNavPositionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HrmsMainRoutingModule,
    SharedModule
  ]
})
export class HrmsMainModule { }
