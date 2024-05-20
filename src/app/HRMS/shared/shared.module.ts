import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameMaxPipe } from './pipe/name-max-length.pipe';




@NgModule({
  declarations: [
    NameMaxPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NameMaxPipe
  ]
})
export class SharedModule { }
