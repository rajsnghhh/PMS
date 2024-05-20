import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RawMaterialSaleComponent } from './components/raw-material-sale/raw-material-sale.component';
import { RawMaterialSaleListComponent } from './components/raw-material-sale-list/raw-material-sale-list.component';
import { RawMaterialSaleAdvancedSearchComponent } from './components/raw-material-sale-advanced-search/raw-material-sale-advanced-search.component';

const routes: Routes = [
  {
    path: '',
    component: RawMaterialSaleAdvancedSearchComponent
  },  
  {
    path: 'add',
    component: RawMaterialSaleComponent
  },
  {
    path: 'add/gst',
    component: RawMaterialSaleComponent
  },
  {
    path: 'edit/:id',
    component: RawMaterialSaleComponent
  },
  {
    path: 'edit/gst/:id',
    component: RawMaterialSaleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RawMaterialSalesRoutingModule { }
