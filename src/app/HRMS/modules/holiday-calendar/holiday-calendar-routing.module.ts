import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayCalendarComponent } from './holiday-calendar.component';
import { HolidaylistViewComponent } from './components/holidaylist-view/holidaylist-view.component';

const routes: Routes = [
  {
    path: '',
    component: HolidayCalendarComponent,
    pathMatch: 'full'
  },
  {
    path: 'holiday_list',
    component: HolidaylistViewComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayCalendarRoutingModule { }
