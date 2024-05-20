import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediclaimRoutingModule } from './mediclaim-routing.module';
import { MediclaimComponent } from './mediclaim.component';
import { MediclaimEnrollmentViewComponent } from './components/mediclaim-enrollment-view/mediclaim-enrollment-view.component';
import { UsefulInformationComponent } from './components/useful-information/useful-information.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MediclaimComponent,
    MediclaimEnrollmentViewComponent,
    UsefulInformationComponent
  ],
  imports: [
    CommonModule,
    MediclaimRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MediclaimModule { }
