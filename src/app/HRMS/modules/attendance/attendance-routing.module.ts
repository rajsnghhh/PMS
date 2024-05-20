import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { ViewAttendanceComponent } from './Components/view-attendance/view-attendance.component';

const routes: Routes = [
  
  {
    path: '',
    component: AttendanceComponent,
    pathMatch: 'full'
  },
  {
    path: 'view-attendance',
    component: ViewAttendanceComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
