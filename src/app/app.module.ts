import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PmsHttpInterceptor } from './Shared/interseptor/pms-http-interceptor';
import { NotFoundComponent } from './Shared/component/not-found/not-found.component';
import { PmsHomeComponent } from './Shared/component/pms-home/pms-home.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PlanningWbsComponent } from './planning-wbs/planning-wbs.component';
import { ComingSoonComponent } from './Shared/component/coming-soon/coming-soon.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    PmsHomeComponent,
    PlanningWbsComponent,
    ComingSoonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 15000, // 15 seconds
      closeButton: true,
      progressBar: true,
    }),
    BrowserAnimationsModule,
    PdfViewerModule
  ],
  providers: [DatePipe,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: PmsHttpInterceptor,
      multi: true
    },
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
