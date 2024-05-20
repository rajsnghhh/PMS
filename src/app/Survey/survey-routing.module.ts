import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyComponent } from './survey.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyComponent
  },
  {
    path: 'viewsurvey',
    component: ViewSurveyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
