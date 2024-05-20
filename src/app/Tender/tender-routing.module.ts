import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenderListComponent } from './Components/tender-list/tender-list.component';
import { AddNewTenderComponent } from './Components/add-new-tender/add-new-tender.component';
import { ArchivedTendersComponent } from './Components/archived-tenders/archived-tenders.component';
import { TenderDetailsListComponent } from './Components/tender-details-list/tender-details-list.component';
import { TenderJvListComponent } from './Components/tender-jv-list/tender-jv-list.component';
import { ActivityTrackerComponent } from './Components/activity-tracker/activity-tracker.component';
import { JvMasterDetailsComponent } from './Components/jv-master-details/jv-master-details.component';
import { EmployeeMasterDetailsComponent } from './Components/employee-master-details/employee-master-details.component';
import { TenderComponent } from './tender.component';

const routes: Routes = [
  {
    path: '',
    component: TenderComponent,
    children: [
      {
        path: '',
        redirectTo: 'evaluations-summary',
        pathMatch: 'full'
      },
      {
        path: 'evaluations-summary',
        component: TenderListComponent,
        pathMatch: 'full'
      },
      {
        path: 'add-new',
        component: AddNewTenderComponent,
        pathMatch: 'full'
      },
      {
        path: 'continue-tender/view/:tenderid',
        component: AddNewTenderComponent,
        pathMatch: 'full'
      },
      {
        path: 'continue-tender/edit/:tenderid',
        component: AddNewTenderComponent,
        pathMatch: 'full'
      },
      {
        path: 'archived',
        component: ArchivedTendersComponent,
        pathMatch: 'full'
      },
      {
        path: 'tender-detail',
        component: TenderDetailsListComponent,
        pathMatch: 'full'
      },
      {
        path: 'tender-jv-detail',
        component: TenderJvListComponent,
        pathMatch: 'full'
      },
      {
        path : 'activity-tracker',
        component: ActivityTrackerComponent,
        pathMatch: 'full'
      },
      {
        path : 'tender-jv-master-details',
        component: JvMasterDetailsComponent,
        pathMatch: 'full'
      },
      {
        path : 'employee-master-details',
        component: EmployeeMasterDetailsComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenderRoutingModule { }
