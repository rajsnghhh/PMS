import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderRoutingModule } from './header-routing.module';
import { HeaderModuleComponent } from './header.component';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderModuleComponent,
  ],
  imports: [
    CommonModule,
    HeaderRoutingModule,
    SharedModuleModule,
    FormsModule
  ],
  exports: [HeaderModuleComponent]
})
export class HeaderModule { }
