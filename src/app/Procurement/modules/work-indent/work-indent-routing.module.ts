import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkIndentComponent } from './components/work-indent/work-indent.component';

const routes: Routes = [
  {
    path: '',
    component: WorkIndentComponent
  },
  {
    path: 'add',
    component: WorkIndentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkIndentRoutingModule { }
