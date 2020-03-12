import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ShapesComponent } from "./shapes/shapes.component";
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent, ShapesComponent],
  imports: [AppRoutingModule, BrowserAnimationsModule, SharedModule, CoreModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
