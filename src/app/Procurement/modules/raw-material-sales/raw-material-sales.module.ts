import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RawMaterialSalesRoutingModule } from './raw-material-sales-routing.module';
import { RawMaterialSaleComponent } from './components/raw-material-sale/raw-material-sale.component';
import { RawMaterialSaleListComponent } from './components/raw-material-sale-list/raw-material-sale-list.component';
import { RawMaterialSaleTopCardComponent } from './components/raw-material-sale/raw-material-sale-top-card/raw-material-sale-top-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RawMaterialSaleTableDataComponent } from './components/raw-material-sale/raw-material-sale-table-data/raw-material-sale-table-data.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RawMaterialSaleTaxComponent } from './components/raw-material-sale/raw-material-sale-tax/raw-material-sale-tax.component';
import { RawMaterialSaleAdvancedSearchComponent } from './components/raw-material-sale-advanced-search/raw-material-sale-advanced-search.component';
import { RawMaterialSaleBottomCardComponent } from './components/raw-material-sale-bottom-card/raw-material-sale-bottom-card.component';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';


@NgModule({
  declarations: [
    RawMaterialSaleComponent,
    RawMaterialSaleListComponent,
    RawMaterialSaleTopCardComponent,
    RawMaterialSaleTableDataComponent,
    RawMaterialSaleTaxComponent,
    RawMaterialSaleAdvancedSearchComponent,
    RawMaterialSaleBottomCardComponent
  ],
  imports: [
    CommonModule,
    RawMaterialSalesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModuleModule
  ]
})
export class RawMaterialSalesModule { }
