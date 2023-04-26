import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NotFoundComponent } from './layout/not-found/not-found.component';
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
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApexOptions } from 'apexcharts';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SellerComponent } from './layout/seller/seller.component';
import { SuppliersComponent } from './layout/suppliers/suppliers.component';
import { SettingsComponent } from './layout/settings/settings.component';
import { LottieModule } from 'ngx-lottie';
import { ConstructionComponent } from './layout/construction/construction.component';
import { MapsComponent } from './layout/maps/maps.component';
import { LoadingComponent } from './layout/loading/loading.component';

export function playerFactory() {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    DashboardComponent,
    NotFoundComponent,
    HeaderComponent,
    LoginComponent,
    SidebarComponent,
    SellerComponent,
    SuppliersComponent,
    SettingsComponent,
    ConstructionComponent,
    MapsComponent,
    LoadingComponent
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
    SidebarModule,
    MenuModule,
    DropdownModule,
    BrowserAnimationsModule,
    ToastModule,
    ConfirmDialogModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
  exports: [DashboardComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
