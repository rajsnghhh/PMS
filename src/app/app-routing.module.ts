import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './Shared/component/not-found/not-found.component';
import { PmsHomeComponent } from './Shared/component/pms-home/pms-home.component';
import { AuthGuardGuard } from './Shared/Guard/auth-guard.guard';
import { ComingSoonComponent } from './Shared/component/coming-soon/coming-soon.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    component: PmsHomeComponent,
    canActivate: [AuthGuardGuard],
    pathMatch: 'full'
  },
  {
    path: 'pms',
    canActivate: [AuthGuardGuard],
    loadChildren: () => import('./productHome/main-product.module').then(m => m.MainProductModule)
  },
  {
    path: 'hrms',
    canActivate: [AuthGuardGuard],
    loadChildren: () => import('./HRMS/hrms-main/hrms-main.module').then(m => m.HrmsMainModule)
  },
  {
    path: 'procurement-quotation',
    loadChildren: () => import('./procurement-quotation/procurement-quotation.module').then(m => m.ProcurementQuotationModule)
  },
  {
    path: 'coming-soon',
    component: ComingSoonComponent,
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
