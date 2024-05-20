import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { ViewProfileComponent } from './Components/view-profile/view-profile.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'view',
    pathMatch : 'full'
  },
  {
      path : 'view',
      component: ViewProfileComponent,
      pathMatch: 'full'
  },
  {
      path : 'resetpassword',
      component: ResetPasswordComponent,
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
