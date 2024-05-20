import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FabricationListComponent } from './fabrication-list/fabrication-list.component';
import { FabricationAddComponent } from './fabrication-add/fabrication-add.component';

const routes: Routes = [
  {
    path: 'add',
    component: FabricationAddComponent
  },
  {
    path: 'list',
    component: FabricationListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FabricationWorkRoutingModule { }
