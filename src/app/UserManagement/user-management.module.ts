import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { UserManagementModuleComponent } from './user-management.component';
import { SearchUserComponent } from './Components/search-user/search-user.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { EditUserComponent } from './Components/edit-user/edit-user.component';
import { UserSettingComponent } from './Components/user-setting/user-setting.component';
import { AddRoleComponent } from './Components/add-role/add-role.component';
import { EditPermissionComponent } from './Components/edit-permission/edit-permission.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneNumberPipe } from '../Shared/Pipes/phone-number.pipe';
import { ImportUserComponent } from './Components/import-user/import-user.component';
import { PaginateModule } from '../Shared/Module/paginate/paginate.module';
import { ManageGroupComponent } from './manage-group/manage-group.component';
import { AddGroupComponent } from './Components/add-group/add-group.component';
import { EditGroupComponent } from './Components/edit-group/edit-group.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { ArchivedUserComponent } from './Components/archived-user/archived-user.component';


@NgModule({
  declarations: [
    UserManagementModuleComponent,
    ManageUserComponent,
    ManageRoleComponent,
    AddUserComponent,
    SearchUserComponent,
    EditUserComponent,
    UserSettingComponent,
    AddRoleComponent,
    EditPermissionComponent,
    PhoneNumberPipe,
    ImportUserComponent,
    ManageGroupComponent,
    AddGroupComponent,
    EditGroupComponent,
    UserActivityComponent,
    ArchivedUserComponent,
  ],
  imports: [
    CommonModule,
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    UserManagementRoutingModule,
    PaginateModule,
    SharedModuleModule
  ]
})
export class UserManagementModule { }
