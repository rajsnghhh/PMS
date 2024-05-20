import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification.component';
import { SharedModuleModule } from "../Shared/Module/shared-module/shared-module.module";


@NgModule({
    declarations: [
        NotificationComponent
    ],
    imports: [
        CommonModule,
        NotificationRoutingModule,
        SharedModuleModule
    ]
})
export class NotificationModule { }
