import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicStripPlannedAchivedComponent } from './dynamic-strip-planned-achived.component';
import { FormsModule } from '@angular/forms';
import { PlanningWbsModule } from 'src/app/planning-wbs/planning-wbs.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { CustomCanvasComponent } from './custom-canvas/custom-canvas.component';
import { ColorPickerModule } from 'ngx-color-picker';



@NgModule({
  declarations: [
    DynamicStripPlannedAchivedComponent,
    CustomCanvasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlanningWbsModule,
    SharedModuleModule,
    ColorPickerModule
  ],
  exports: [
    DynamicStripPlannedAchivedComponent
  ]
})
export class DynamicStripPlannedAchivedModule { }
