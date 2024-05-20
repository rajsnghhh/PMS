import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { CreateProjectComponent } from './Components/create-project/create-project.component';
import { JvIncorporationComponent } from './Components/jv-incorporation/jv-incorporation.component';
import { ProjectMasterComponent } from './Components/project-master/project-master.component';
import { ProcurementSiteComponent } from './Components/procurement-site/procurement-site.component';
import { ProjectStoreComponent } from './Components/project-store/project-store.component';
import { ProjectUserManagementComponent } from './Components/project-user-management/project-user-management.component';
import { CummunicationComponent } from './Components/cummunication/cummunication.component';

const routes: Routes = [
  { 
    path: '', 
    component: ProjectComponent 
  },
  { 
    path: 'communication/:projectId', 
    component: CummunicationComponent
  },
  {
    path : 'create-project/:tenderId/:projectId',
    component: CreateProjectComponent,
    pathMatch: 'full'
  },
  {
    path : 'edit-project/:tenderId/:projectId',
    component: CreateProjectComponent,
    pathMatch: 'full'
  },
  {
    path : 'jv-incorporation/:tenderId/:projectId',
    component: JvIncorporationComponent,
    pathMatch: 'full'
  },
  {
    path : 'edit-jv-incorporation/:tenderId/:projectId',
    component: JvIncorporationComponent,
    pathMatch: 'full'
  },
  {
    path : 'master/:projectId',
    component: ProjectMasterComponent,
    pathMatch: 'full'
  },
  {
    path: 'master/site/:projectId',
    component: ProcurementSiteComponent,
    pathMatch: 'full'
  },
  {
    path: 'master/store/:projectId',
    component: ProjectStoreComponent,
    pathMatch: 'full'
  },
  {
    path: 'master/users/:projectId',
    component: ProjectUserManagementComponent,
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
