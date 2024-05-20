import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePlantProdComponent } from './components/create-plant-prod/create-plant-prod.component';
import { PlantProdAdvancedSearchComponent } from './components/plant-prod-advanced-search/plant-prod-advanced-search.component';

const routes: Routes = [
  {
    path: '',
    component: PlantProdAdvancedSearchComponent
  },
  {
    path: 'create',
    component: CreatePlantProdComponent
  },
  {
    path: 'modify/:id',
    component: CreatePlantProdComponent
  },
  {
    path: 'view/:id',
    component: CreatePlantProdComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantAndProductionRoutingModule { }
