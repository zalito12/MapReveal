import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MapCreationComponent } from "./map-creation/map-creation.component";

const routes: Routes = [{ path: "**", component: MapCreationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
