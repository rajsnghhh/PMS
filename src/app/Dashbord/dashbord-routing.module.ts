import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '../Shared/Guard/auth-guard.guard';
import { DashbordMainComponent } from './dashbord-main.component';

const routes: Routes = [
  {
    path : '',
    canActivate: [AuthGuardGuard],
    component: DashbordMainComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashbordRoutingModule { }
