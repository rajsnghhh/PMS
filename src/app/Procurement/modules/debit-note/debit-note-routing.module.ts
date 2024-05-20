import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateDebitNoteComponent } from './add-update-debit-note/add-update-debit-note.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddUpdateDebitNoteComponent,
  },
  {
    path: 'add/:id',
    component: AddUpdateDebitNoteComponent,
  },
  {
    path: 'list',
    component: DebitNoteComponent,
  },
  {
    path: 'edit/:id',
    component: AddUpdateDebitNoteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebitNoteRoutingModule { }
