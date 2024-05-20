import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LmpiBoqComponent } from './lmpi-boq.component';
import { FormsModule } from '@angular/forms';
import { LabourComponent } from './components/labour/labour.component';
import { MaterialComponent } from './components/material/material.component';
import { PneComponent } from './components/pne/pne.component';
import { IdcComponent } from './components/idc/idc.component';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';



@NgModule({
  declarations: [
    LmpiBoqComponent,
    LabourComponent,
    MaterialComponent,
    PneComponent,
    IdcComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModuleModule
  ],
  exports: [
    LmpiBoqComponent,
    LabourComponent,
    MaterialComponent,
    PneComponent,
    IdcComponent
  ]
})
export class LmpiBoqModule { }
