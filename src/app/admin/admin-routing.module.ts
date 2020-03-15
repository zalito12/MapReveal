import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapCreationComponent } from './map-creation/map-creation.component';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

const routes: Routes = [
  { path: 'home', component: AdminPageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create', component: CreateComponent },
  { path: 'map', component: MapCreationComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
