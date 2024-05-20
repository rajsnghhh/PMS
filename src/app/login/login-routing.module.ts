import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModuleComponent } from './loginmodule.component';
import { ForgetPasswordComponent } from './view/forget-password/forget-password.component';
import { LoginFormComponent } from './view/login-form/login-form.component';

const routes: Routes = [
  {
    path: '',
    component: LoginModuleComponent,
    children : [
      {
        path : '',
        component : LoginFormComponent,
        pathMatch: 'full'
      },
      {
        path : 'forgetPassword',
        component: ForgetPasswordComponent,
        pathMatch: 'full'
      },
      {
        path : 'forgetPassword/:action/:sccurity/:token',
        component: ForgetPasswordComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
