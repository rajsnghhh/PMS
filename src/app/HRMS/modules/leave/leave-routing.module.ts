import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveComponent } from './leave.component';
import { ApplyLeaveComponent } from './Components/apply-leave/apply-leave.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveComponent,
    pathMatch: 'full'
  },
  {
    path: 'apply-leave',
    component: ApplyLeaveComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
