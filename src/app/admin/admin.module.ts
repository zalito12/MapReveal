import { NgModule } from "@angular/core";
import { MapCreationComponent } from "./map-creation/map-creation.component";
import { SharedModule } from "../shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";

@NgModule({
  declarations: [MapCreationComponent],
  imports: [AdminRoutingModule, SharedModule]
})
export class AdminModule {}
