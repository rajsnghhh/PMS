import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WayBillComponent } from './components/way-bill/way-bill.component';
import { WayBillAdvancedSearchComponent } from './components/way-bill-advanced-search/way-bill-advanced-search.component';
import { WayBillLinkingComponent } from './components/way-bill-linking/way-bill-linking.component';

const routes: Routes = [
  {
    path: '',
    component: WayBillAdvancedSearchComponent
  }, 
  {
    path: 'add',
    component: WayBillComponent
  }, 
  {
    path: 'edit/:way_bill_id',
    component: WayBillComponent
  },
  {
    path: 'linking',
    component: WayBillLinkingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WayBillRoutingModule { }
