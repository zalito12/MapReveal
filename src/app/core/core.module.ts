import { NgModule } from '@angular/core';
import { ScrollService } from './scroll.service';
import { GlobalSettingsService } from './global-settings.service';
import { LayerService } from './layer.service';
import { SpeakerService } from './speaker.service';
import { AdminSettingsService } from '../admin/services/admin-settings.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [SpeakerService, LayerService, ScrollService, GlobalSettingsService, AdminSettingsService]
})
export class CoreModule {}
