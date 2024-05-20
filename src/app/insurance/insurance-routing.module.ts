import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuranceComponent } from './insurance.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'insurance',
    pathMatch: 'full'
  },
  {
    path: 'insurance',
    component: InsuranceComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
