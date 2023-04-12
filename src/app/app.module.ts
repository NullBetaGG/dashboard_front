import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { TableComponent } from './layout/table/table.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [	
    AppComponent,
    TableComponent,
    DashboardComponent,
    NotFoundComponent,
      HeaderComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
