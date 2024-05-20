import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GatePassRoutingModule } from './gate-pass-routing.module';
import { GatePassListComponent } from './components/gate-pass-list/gate-pass-list.component';
import { GatePassAdvanceSearchComponent } from './components/gate-pass-advance-search/gate-pass-advance-search.component';
import { GatePassAddComponent } from './components/gate-pass-add/gate-pass-add.component';
import { GatePassAddTopCardComponent } from './components/gate-pass-add-top-card/gate-pass-add-top-card.component';
import { GatePassAddTableComponent } from './components/gate-pass-add-table/gate-pass-add-table.component';
import { GatePassAddBottomComponent } from './components/gate-pass-add-bottom/gate-pass-add-bottom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModuleModule } from 'src/app/Shared/Module/shared-module/shared-module.module';
import { TransportationComponent } from './components/transportation/transportation.component';


@NgModule({
  declarations: [
    GatePassListComponent,
    GatePassAdvanceSearchComponent,
    GatePassAddComponent,
    GatePassAddTopCardComponent,
    GatePassAddTableComponent,
    GatePassAddBottomComponent,
    TransportationComponent
  ],
  imports: [
    CommonModule,
    GatePassRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModuleModule
  ]
})
export class GatePassModule { }
