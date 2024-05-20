import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrmsMainComponent } from './hrms-main.component';
import { SecureContentGuard } from 'src/app/Shared/Guard/secure-content.guard';

const routes: Routes = [
  {
    path     : '',
    component: HrmsMainComponent,
    canActivate: [SecureContentGuard],
    children : [
      {
        path : '',
        loadChildren: () => import('../modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path : 'attendance',
        loadChildren: () => import('../modules/attendance/attendance.module').then(m => m.AttendanceModule),
      },
      {
        path : 'leave',
        loadChildren: () => import('../modules/leave/leave.module').then(m => m.LeaveModule),
      },
      {
        path : 'usermanagement',
        loadChildren: () => import('../../UserManagement/user-management.module').then(m => m.UserManagementModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('../../settings/settings.module').then(m => m.SettingsModule)
      },  
      {
        path: 'profile',
        loadChildren: () => import('../../profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'mediclaim',
        loadChildren: () => import('../modules/mediclaim/mediclaim.module').then(m => m.MediclaimModule)
      },
      {
        path: 'holiday',
        loadChildren: () => import('../modules/holiday-calendar/holiday-calendar.module').then(m => m.HolidayCalendarModule)
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsMainRoutingModule { }
