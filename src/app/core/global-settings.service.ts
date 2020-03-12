import { Injectable } from '@angular/core';
import { OnZoom } from './OnZoom';
import { SpeakerService } from './speaker-service';

@Injectable()
export class GlobalSettingsService extends SpeakerService<OnZoom> {
  private scale = 1.0;
  public zoomListeners: OnZoom[] = [];

  constructor() {
    super();
  }

  public setScale(scale: number) {
    this.scale = scale;
    if (this.zoomListeners.length > 0) {
      this.zoomListeners.forEach(listener => listener.onZoomChange(this.scale));
    }
  }

  public getScale(): number {
    return this.scale;
  }

  public getListeners(): OnZoom[] {
    return this.zoomListeners;
  }
}
