import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkIndentRoutingModule } from './work-indent-routing.module';
import { WorkIndentComponent } from './components/work-indent/work-indent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginateModule } from 'src/app/Shared/Module/paginate/paginate.module';
import { AddUpdateWorkIndentComponent } from './components/add-update-work-indent/add-update-work-indent.component';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';


@NgModule({
  declarations: [
    WorkIndentComponent,
    AddUpdateWorkIndentComponent
  ],
  imports: [
    CommonModule,
    WorkIndentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginateModule,
    SharedModuleModule
  ]
})
export class WorkIndentModule { }
