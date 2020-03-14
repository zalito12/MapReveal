import { NgModule } from '@angular/core';
import { ScrollService } from './scroll.service';
import { GlobalSettingsService } from './global-settings.service';
import { LayerService } from './layer.service';
import { SpeakerService } from './speaker.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [SpeakerService, LayerService, ScrollService, GlobalSettingsService]
})
export class CoreModule {}
