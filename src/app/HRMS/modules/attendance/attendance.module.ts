import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AddAttendanceComponent } from './Components/add-attendance/add-attendance.component';
import { ViewAttendanceComponent } from './Components/view-attendance/view-attendance.component';
import { AttendanceComponent } from './attendance.component';
import { ViewFortnightComponent } from './Components/view-fortnight/view-fortnight.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { ProgressBarComponent } from './Components/progress-bar/progress-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddAttendanceComponent,
    ViewAttendanceComponent,
    AttendanceComponent,
    ViewFortnightComponent,
    CalendarComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AttendanceModule { }
