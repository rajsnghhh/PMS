import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { SharedModuleModule } from "../Shared/Module/shared-module/shared-module.module";
import { PaginateModule } from "../Shared/Module/paginate/paginate.module";
import { CreateProjectComponent } from './Components/create-project/create-project.component';
import { DynamicFormsModule } from '../Shared/Module/dynamic-forms/dynamic-forms.module';
import { ProjectHeadComponent } from './Components/project-head/project-head.component';
import { PlanningHeadComponent } from './Components/planning-head/planning-head.component';
import { JvIncorporationComponent } from './Components/jv-incorporation/jv-incorporation.component';
import { ProjectMasterComponent } from './Components/project-master/project-master.component';
import { ProcurementSiteComponent } from './Components/procurement-site/procurement-site.component';
import { AddUpdateProcurementSiteComponent } from './Components/procurement-site/add-update-procurement-site/add-update-procurement-site.component';
import { ProjectStoreComponent } from './Components/project-store/project-store.component';
import { AddUpdateProjectStoreComponent } from './Components/project-store/add-update-project-store/add-update-project-store.component';
import { ProjectUserManagementComponent } from './Components/project-user-management/project-user-management.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CummunicationComponent } from './Components/cummunication/cummunication.component';
import { AddEditCommunicationComponent } from './Components/cummunication/add-edit-communication/add-edit-communication.component';

@NgModule({
    declarations: [
        ProjectComponent,
        CreateProjectComponent,
        ProjectHeadComponent,
        PlanningHeadComponent,
        JvIncorporationComponent,
        ProjectMasterComponent,
        ProcurementSiteComponent,
        AddUpdateProcurementSiteComponent,
        ProjectStoreComponent,
        AddUpdateProjectStoreComponent,
        ProjectUserManagementComponent,
        CummunicationComponent,
        AddEditCommunicationComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProjectRoutingModule,
        SharedModuleModule,
        PaginateModule,
        DynamicFormsModule,
        NgSelectModule,
        AngularMultiSelectModule,
    ]
})
export class ProjectModule { }
