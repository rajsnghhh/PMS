import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantMachinaryComponent } from './plant-machinary.component';

const routes: Routes = [{ path: '', component: PlantMachinaryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantMachinaryRoutingModule { }
