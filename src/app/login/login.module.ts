import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { ForgetPasswordComponent } from './view/forget-password/forget-password.component';
import { LoginModuleComponent } from './loginmodule.component';
import { LoginFormComponent } from './view/login-form/login-form.component';


@NgModule({
  declarations: [
    LoginModuleComponent,
    ForgetPasswordComponent,
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
