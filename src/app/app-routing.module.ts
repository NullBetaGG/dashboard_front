import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { TableComponent } from './layout/table/table.component';
import { LoginComponent } from './login/login.component';
import { MapsComponent } from './layout/maps/maps.component';
import { AuthGuard } from './auth.guard';


const appRoutes: Routes = [
  { path: 'dash', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tables', component: TableComponent, canActivate: [AuthGuard] },
  { path: 'maps', component: MapsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dash', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
