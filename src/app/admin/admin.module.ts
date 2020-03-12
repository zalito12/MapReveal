import { NgModule } from "@angular/core";
import { MapCreationComponent } from "./map-creation/map-creation.component";
import { SharedModule } from "../shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

@NgModule({
  declarations: [MapCreationComponent, AdminSettingsComponent],
  imports: [AdminRoutingModule, SharedModule]
})
export class AdminModule {}
