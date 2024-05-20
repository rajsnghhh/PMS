import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { SendEnquiryComponent } from './send-enquiry/send-enquiry.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddEnquiryComponent
  },
  {
    path: 'update/:editid',
    component: AddEnquiryComponent
  },
  {
    path: 'send-enquiry',
    component: SendEnquiryComponent
  },
  {
    path: 'list',
    component: EnquiryListComponent
  },
  {
    path: '',
    component: EnquiryListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquiryRoutingModule { }
