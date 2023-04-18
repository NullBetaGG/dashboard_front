import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { TableComponent } from './layout/table/table.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    DashboardComponent,
    NotFoundComponent,
    HeaderComponent,
    LoginComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    DialogModule,
    CardModule,
    FormsModule,
    NgxChartsModule,
    SidebarModule,
    MenuModule
  ],
  exports: [DashboardComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
