import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DasNavComponent } from './components/das-nav/das-nav.component';
import { FortnightPreviewComponent } from './components/fortnight-preview/fortnight-preview.component';
import { NoticeBoardComponent } from './components/notice-board/notice-board.component';
import { LeavePreviewComponent } from './components/leave-preview/leave-preview.component';
import { LeaveGraphComponent } from './components/leave-graph/leave-graph.component';
import { HolidayPreviewComponent } from './components/holiday-preview/holiday-preview.component';
import { BirthdaysPreviewComponent } from './components/birthdays-preview/birthdays-preview.component';
import { OnBoardingComponent } from './components/on-boarding/on-boarding.component';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    DashboardComponent,
    DasNavComponent,
    FortnightPreviewComponent,
    NoticeBoardComponent,
    LeavePreviewComponent,
    LeaveGraphComponent,
    HolidayPreviewComponent,
    BirthdaysPreviewComponent,
    OnBoardingComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CarouselModule
  ]
})
export class DashboardModule { }
