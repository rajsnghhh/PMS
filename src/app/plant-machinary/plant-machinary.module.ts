import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantMachinaryRoutingModule } from './plant-machinary-routing.module';
import { PlantMachinaryComponent } from './plant-machinary.component';
import { AddPlantMachinaryComponent } from './Components/add-plant-machinary/add-plant-machinary.component';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { PaginateModule } from '../Shared/Module/paginate/paginate.module';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { DynamicFormsModule } from '../Shared/Module/dynamic-forms/dynamic-forms.module';


@NgModule({
  declarations: [
    PlantMachinaryComponent,
    AddPlantMachinaryComponent,
  ],
  imports: [
    CommonModule,
    PlantMachinaryRoutingModule,
    FormsModule,
    AngularMultiSelectModule,
    PaginateModule,
    SharedModuleModule,
    DynamicFormsModule
  ]
})
export class PlantMachinaryModule { }
