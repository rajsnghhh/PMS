import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { ViewProfileComponent } from './Components/view-profile/view-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CharOnlyDirective } from '../Shared/Directive/char-only.directive';
import { NumbersOnlyDirective } from '../Shared/Directive/numbers-only.directive';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';


@NgModule({
  declarations: [
    ResetPasswordComponent,
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule
  ]
})
export class ProfileModule { }
