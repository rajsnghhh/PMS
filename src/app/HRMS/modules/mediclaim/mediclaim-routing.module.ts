import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediclaimComponent } from './mediclaim.component';
import { MediclaimEnrollmentViewComponent } from './components/mediclaim-enrollment-view/mediclaim-enrollment-view.component';
import { UsefulInformationComponent } from './components/useful-information/useful-information.component';

const routes: Routes = [
    {
    path: '',
    component: MediclaimComponent,
    pathMatch: 'full'
  },
  {
    path: 'view-mediclaim',
    component: MediclaimEnrollmentViewComponent,
    pathMatch: 'full'
  },
  {
    path: 'useful-information',
    component: UsefulInformationComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediclaimRoutingModule { }
