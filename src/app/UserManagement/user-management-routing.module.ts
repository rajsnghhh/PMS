import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '../Shared/Guard/auth-guard.guard';
import { ManageGroupComponent } from './manage-group/manage-group.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { ArchivedUserComponent } from './Components/archived-user/archived-user.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'manageUser',
    pathMatch : 'full'
  },
  {
      path : 'manageUser',
      canActivate: [AuthGuardGuard],
      component: ManageUserComponent,
      pathMatch: 'full'
  },
  {
    path: 'archived-user',
    component: ArchivedUserComponent,
    pathMatch: 'full'
  },
  {
      path : 'manageProfile',
      canActivate: [AuthGuardGuard],
      data: {url: ['Manage Profile & Permission']},
      component: ManageRoleComponent,
      pathMatch: 'full'
  },
  {
    path : 'manageGroup',
    canActivate: [AuthGuardGuard],
    component: ManageGroupComponent,
    pathMatch: 'full'
  },
  {
    path : 'userActivity',
    canActivate: [AuthGuardGuard],
    component: UserActivityComponent,
    pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
