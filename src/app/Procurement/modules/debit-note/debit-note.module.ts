import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebitNoteRoutingModule } from './debit-note-routing.module';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { AddUpdateDebitNoteComponent } from './add-update-debit-note/add-update-debit-note.component';
import { FormsModule } from '@angular/forms';
 

@NgModule({
  declarations: [
    DebitNoteComponent,
    AddUpdateDebitNoteComponent,
   ],
  imports: [
    CommonModule,
    DebitNoteRoutingModule,
    FormsModule
  ]
})
export class DebitNoteModule { }
