import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveComponent } from './leave.component';
import { ApplyLeaveComponent } from './Components/apply-leave/apply-leave.component';
import { ApplyAdvanceLeaveComponent } from './Components/apply-leave/apply-advance-leave/apply-advance-leave.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LeaveComponent,
    ApplyLeaveComponent,
    ApplyAdvanceLeaveComponent
  ],
  imports: [
    CommonModule,
    LeaveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class LeaveModule { }
