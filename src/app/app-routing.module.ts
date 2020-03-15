import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule)
  },
  {
    path: "view",
    loadChildren: () =>
      import("./player/player.module").then(m => m.PlayerModule)
  },
  { path: "**", redirectTo: "/admin/dashboard" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
