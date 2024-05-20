import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantAndProductionRoutingModule } from './plant-and-production-routing.module';
import { CreatePlantProdComponent } from './components/create-plant-prod/create-plant-prod.component';
import { PlantProdAdvancedSearchComponent } from './components/plant-prod-advanced-search/plant-prod-advanced-search.component';
import { PlantProdTopCardComponent } from './components/plant-prod-top-card/plant-prod-top-card.component';
import { CreatePlantProdTableComponent } from './components/create-plant-prod-table/create-plant-prod-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlantProdListComponent } from './components/plant-prod-list/plant-prod-list.component';
import { PaginateModule } from "../../../Shared/Module/paginate/paginate.module";


@NgModule({
    declarations: [
        CreatePlantProdComponent,
        PlantProdAdvancedSearchComponent,
        PlantProdTopCardComponent,
        CreatePlantProdTableComponent,
        PlantProdListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PlantAndProductionRoutingModule,
        SharedModuleModule,
        NgSelectModule,
        PaginateModule
    ]
})
export class PlantAndProductionModule { }
