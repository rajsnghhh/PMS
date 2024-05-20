import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenderRoutingModule } from './tender-routing.module';
import { TenderListComponent } from './Components/tender-list/tender-list.component';
import { AddNewTenderComponent } from './Components/add-new-tender/add-new-tender.component';
import { ArchivedTendersComponent } from './Components/archived-tenders/archived-tenders.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { PaginateModule } from '../Shared/Module/paginate/paginate.module';
import { FilterTenderComponent } from './Components/filter-tender/filter-tender.component';
import { TenderDetailsListComponent } from './Components/tender-details-list/tender-details-list.component';
import { FilerTenderDetailComponent } from './Components/filer-tender-detail/filer-tender-detail.component';
import { DynamicFormsModule } from '../Shared/Module/dynamic-forms/dynamic-forms.module';
import { TenderJvListComponent } from './Components/tender-jv-list/tender-jv-list.component';
import { ActivityTrackerComponent } from './Components/activity-tracker/activity-tracker.component';
import { TenderExicutiveCommtteeComponent } from './Components/tender-exicutive-commttee/tender-exicutive-commttee.component';
import { JvMasterDetailsComponent } from './Components/jv-master-details/jv-master-details.component';
import { TenderTopSheetComponent } from './Components/tender-top-sheet/tender-top-sheet.component';
import { EmployeeMasterDetailsComponent } from './Components/employee-master-details/employee-master-details.component';
import { TenderComponent } from './tender.component';
import { ExecutiveSummaryModule } from '../executive-summary/executive-summary.module';
import { SearchTenderComponent } from './Components/search-tender/search-tender.component';
import { JvShareAnalyticsComponent } from './Components/jv-share-analytics/jv-share-analytics.component';
import { StatusBoxComponent } from '../Shared/Module/status-box/status-box.component';
import { LmpiBoqModule } from '../lmpi-boq/lmpi-boq.module';


@NgModule({
  declarations: [
    TenderListComponent,
    AddNewTenderComponent,
    ArchivedTendersComponent,
    FilterTenderComponent,
    TenderDetailsListComponent,
    FilerTenderDetailComponent,
    TenderJvListComponent,
    ActivityTrackerComponent,
    TenderExicutiveCommtteeComponent,
    JvMasterDetailsComponent,
    TenderTopSheetComponent,
    EmployeeMasterDetailsComponent,
    TenderComponent,
    SearchTenderComponent,
    JvShareAnalyticsComponent,
    StatusBoxComponent,
  ],
  imports: [
    CommonModule,
    TenderRoutingModule,
    AngularMultiSelectModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModuleModule,
    PaginateModule,
    DynamicFormsModule,
    ExecutiveSummaryModule,
    LmpiBoqModule
  ]
})
export class TenderModule { }
