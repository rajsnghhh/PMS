import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePaginateComponent } from './table-paginate.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TablePaginateComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule
  ],
  exports: [
    TablePaginateComponent
  ]
})
export class PaginateModule { }
