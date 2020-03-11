import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShapesComponent } from "./shapes/shapes.component";

const routes: Routes = [
  {
    path: "create",
    loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule)
  },
  {
    path: "view",
    loadChildren: () =>
      import("./player/player.module").then(m => m.PlayerModule)
  },
  { path: "shapes", component: ShapesComponent },
  { path: "**", redirectTo: "/create" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
