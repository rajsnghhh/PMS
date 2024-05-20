import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttRoutingModule } from './gantt-routing.module';
import { GanttComponent } from '../gantt/gantt.component';
import { NgGanttEditorModule } from 'ng-gantt';
import { FormsModule } from '@angular/forms';
import { LmpiBoqModule } from '../lmpi-boq/lmpi-boq.module';


@NgModule({
  declarations: [
    GanttComponent
  ],
  imports: [
    CommonModule,
    GanttRoutingModule,
    NgGanttEditorModule,
    FormsModule,
    LmpiBoqModule
  ],
  exports : [
    GanttComponent
  ]
})
export class GanttModule { }
