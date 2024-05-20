import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyComponent } from './survey.component';
import { SurveyProgressNavComponent } from './survey-progress-nav/survey-progress-nav.component';
import { SurveyContentComponent } from './survey-content/survey-content.component';
import { BasicDetailsComponent } from './survey-content/Components/basic-details/basic-details.component';
import { LocationDetailsComponent } from './survey-content/Components/location-details/location-details.component';
import { GeneralDetailsComponent } from './survey-content/Components/general-details/general-details.component';
import { HydrologicalDataComponent } from './survey-content/Components/hydrological-data/hydrological-data.component';
import { NameOfWorkComponent } from './survey-content/Components/name-of-work/name-of-work.component';
import { DocumentCollectionComponent } from './survey-content/Components/document-collection/document-collection.component';
import { LocalDataComponent } from './survey-content/Components/local-data/local-data.component';
import { CompetitionAnalysisComponent } from './survey-content/Components/competition-analysis/competition-analysis.component';
import { MaterialRatesComponent } from './survey-content/Components/material-rates/material-rates.component';
import { ItemsComponent } from './survey-content/Components/items/items.component';
import { OtherDetailsComponent } from './survey-content/Components/other-details/other-details.component';
import { BridgeWorkComponent } from './survey-content/Components/name-of-work/bridge-work/bridge-work.component';
import { RoadWorkComponent } from './survey-content/Components/name-of-work/road-work/road-work.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocNametoIMGPipe } from '../Shared/Pipes/doc-nameto-img.pipe';
import { ContactDetailComponent } from './survey-content/Components/document-collection/contact-detail/contact-detail.component';
import { CompanySurveyComponent } from './survey-content/Components/competition-analysis/company-survey/company-survey.component';
import { CompanyWorkingComponent } from './survey-content/Components/competition-analysis/company-working/company-working.component';
import { CompanyParticipateComponent } from './survey-content/Components/competition-analysis/company-participate/company-participate.component';
import { WorksAwardedComponent } from './survey-content/Components/competition-analysis/works-awarded/works-awarded.component';
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddItemComponent } from './survey-content/Components/add-item/add-item.component';
import { EditItemComponent } from './survey-content/Components/edit-item/edit-item.component';
import { EditCompanySurveyComponent } from './survey-content/Components/edit-company-survey/edit-company-survey.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';


@NgModule({
  declarations: [
    SurveyComponent,
    SurveyProgressNavComponent,
    SurveyContentComponent,
    BasicDetailsComponent,
    LocationDetailsComponent,
    GeneralDetailsComponent,
    HydrologicalDataComponent,
    NameOfWorkComponent,
    DocumentCollectionComponent,
    LocalDataComponent,
    CompetitionAnalysisComponent,
    MaterialRatesComponent,
    ItemsComponent,
    OtherDetailsComponent,
    BridgeWorkComponent,
    RoadWorkComponent,
    DocNametoIMGPipe,
    ContactDetailComponent,
    CompanySurveyComponent,
    CompanyWorkingComponent,
    CompanyParticipateComponent,
    WorksAwardedComponent,
    AddItemComponent,
    EditItemComponent,
    EditCompanySurveyComponent,
    ViewSurveyComponent
  ],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    FormsModule,
    SharedModuleModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    PdfViewerModule
  ]
})
export class SurveyModule { }
platformBrowserDynamic().bootstrapModule(SurveyModule);
