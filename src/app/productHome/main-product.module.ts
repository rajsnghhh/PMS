import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainProductRoutingModule } from './main-product-routing.module';
import { NavPositionComponent } from './nav-position/nav-position.component';
import { MainProductComponent } from './main-product.component';
import { HeaderModule } from '../Header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../Header/sidebar/sidebar.component';


@NgModule({
  declarations: [
    MainProductComponent,
    NavPositionComponent,
    SidebarComponent

  ],
  imports: [
    CommonModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule,
    MainProductRoutingModule
  ]
})
export class MainProductModule { }
