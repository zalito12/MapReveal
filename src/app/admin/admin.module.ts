import { NgModule } from '@angular/core';
import { MapCreationComponent } from './map-creation/map-creation.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent } from './create/create.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminSettingsService } from './services/admin-settings.service';
import { AdminDataService } from './services/admin-data.service';

@NgModule({
  declarations: [MapCreationComponent, AdminSettingsComponent, DashboardComponent, CreateComponent, AdminPageComponent],
  imports: [AdminRoutingModule, SharedModule],
  providers: [AdminSettingsService, AdminDataService]
})
export class AdminModule {}
