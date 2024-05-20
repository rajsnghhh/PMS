import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HolidayCalendarRoutingModule } from './holiday-calendar-routing.module';
import { HolidayCalendarComponent } from './holiday-calendar.component';
import { HolidaylistViewComponent } from './components/holidaylist-view/holidaylist-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginateModule } from "../../../Shared/Module/paginate/paginate.module";


@NgModule({
    declarations: [
        HolidayCalendarComponent,
        HolidaylistViewComponent
    ],
    imports: [
        CommonModule,
        HolidayCalendarRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        PaginateModule
    ]
})
export class HolidayCalendarModule { }
