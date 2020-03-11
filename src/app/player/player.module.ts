import { NgModule } from '@angular/core';

import { PlayerRoutingModule } from './player-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [MapViewComponent],
  imports: [
    PlayerRoutingModule,
    SharedModule
  ]
})
export class PlayerModule { }
