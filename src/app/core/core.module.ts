import { NgModule } from '@angular/core';
import { ScrollService } from './scroll.service';
import { GlobalSettingsService } from './global-settings.service';



@NgModule({
  declarations: [],
  imports: [],
  providers: [GlobalSettingsService, ScrollService]
})
export class CoreModule { }
