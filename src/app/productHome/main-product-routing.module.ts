import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '../Shared/Guard/auth-guard.guard';
import { MainProductComponent } from './main-product.component';


const routes: Routes = [

  {
    path: '',
    component: MainProductComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashbord',
        pathMatch: 'full'
      },
      {
        path: 'dashbord',
        canActivate: [AuthGuardGuard],
        loadChildren: () => import('../Dashbord/dashbord.module').then(m => m.DashbordModule),
      },
      {
        path: 'usermanagement',
        canActivate: [AuthGuardGuard],
        loadChildren: () => import('../UserManagement/user-management.module').then(m => m.UserManagementModule),
      },
      {
        path: 'tender',
        canActivate: [AuthGuardGuard],
        loadChildren: () => import('../Tender/tender.module').then(m => m.TenderModule),
      },
      // {
      //   path: 'survey',
      //   canActivate: [AuthGuardGuard],
      //   loadChildren: () => import('../Survey/survey.module').then(m => m.SurveyModule),
      // }, //Survey module is part of Mobile Application
      {
        path: 'settings',
        // canActivate: [AuthGuardGuard],
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'profile',
        canActivate: [AuthGuardGuard],
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'insurance',
        // canActivate: [AuthGuardGuard],
        loadChildren: () => import('../insurance/insurance.module').then(m => m.InsuranceModule),
      },
      {
        path: 'plant_machinary',
        loadChildren: () => import('../plant-machinary/plant-machinary.module').then(m => m.PlantMachinaryModule)
      },
      {
        path: 'planning',
        loadChildren: () => import('../planning/planning.module').then(m => m.PlanningModule)
      },
      {
        path: ':procurementScope/procurement',
        canActivate: [AuthGuardGuard],
        data: { url: ['CustomCheckOnGurd'] },
        loadChildren: () => import('../Procurement/procurement-main/procurement-main.module').then(m => m.ProcurementMainModule)
      },
      // {
      //   path: 'store/procurement',
      //   canActivate: [AuthGuardGuard],
      //   data: {url: ['Store']},
      //   loadChildren: () => import('../Procurement/procurement-main/procurement-main.module').then(m => m.ProcurementMainModule)
      // },
      // {
      //   path: 'purchase/procurement',
      //   canActivate: [AuthGuardGuard],
      //   data: {url: ['Purchase']},
      //   loadChildren: () => import('../Procurement/procurement-main/procurement-main.module').then(m => m.ProcurementMainModule)
      // },
      {
        path: 'store',
        canActivate: [AuthGuardGuard],
        data: { url: ['Store'] },
        loadChildren: () => import('../Procurement/modules/store/store.module').then(m => m.StoreModule)
      },
      {
        path: 'budget',
        loadChildren: () => import('../budget/budget.module').then(m => m.BudgetModule)
      },
      {
        path: 'gant',
        loadChildren: () => import('../gantt/gantt.module').then(m => m.GanttModule)
      },
      {
        path: 'project',
        canActivate: [AuthGuardGuard],
        data: { url: ['Project'] },
        loadChildren: () => import('../project/project.module').then(m => m.ProjectModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then(m => m.NotificationModule)
      },
      {
        path: 'planning-wbs',
        loadChildren: () => import('../planning-wbs/planning-wbs.module').then(m => m.PlanningWbsModule)
      },
      {
        path: 'budget-accounts',
        loadChildren: () => import('../budget-accounts/budget-accounts.module').then(m => m.BudgetAccountsModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainProductRoutingModule { }
