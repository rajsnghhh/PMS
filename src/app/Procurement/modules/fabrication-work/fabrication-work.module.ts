import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FabricationWorkRoutingModule } from './fabrication-work-routing.module';
import { FabricationListComponent } from './fabrication-list/fabrication-list.component';
import { FabricationAddComponent } from './fabrication-add/fabrication-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    FabricationListComponent,
    FabricationAddComponent
  ],
  imports: [
    CommonModule,
    FabricationWorkRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule

  ]
})
export class FabricationWorkModule { }
