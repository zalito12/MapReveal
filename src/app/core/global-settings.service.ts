import { Injectable } from '@angular/core';
import { ScrollService } from './scroll.service';
import { LayerService } from './layer.service';
import { SpeakerService } from './speaker.service';

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const STEP = 0.1;

@Injectable()
export class GlobalSettingsService {
  private zoom = 1.0;

  private scrollAction: 'Scroll' | 'Zoom' = 'Zoom';

  constructor(
    private speakerService: SpeakerService,
    private layerService: LayerService,
    private scrollService: ScrollService
  ) {}

  public setZoom(scale: number) {
    this.zoom = scale;
    this.speakerService.updateZoom(this.zoom);
  }

  public getZoom(): number {
    return this.zoom;
  }

  public getMinZoom(): number {
    return MIN_SCALE;
  }

  public getMaxZoom(): number {
    return MAX_SCALE;
  }

  public getZoomStep(): number {
    return STEP;
  }

  public getScrollAction(): 'Scroll' | 'Zoom' {
    return this.scrollAction;
  }

  public setScrollAction(scrollAction: 'Scroll' | 'Zoom'): void {
    this.scrollAction = scrollAction;
    if (this.scrollAction === 'Zoom') {
      this.setWheelZoomListener();
    } else {
      this.removeWheelZoomListener();
    }
  }

  public setWheelZoomListener(): void {
    const scaleBy = 0.1;
    this.layerService.getStage().on('wheel', e => {
      e.evt.preventDefault();
      var oldScale = this.layerService.getBaseLayer().scaleX();

      var mousePointTo = {
        x:
          this.layerService.getStage().getPointerPosition().x / oldScale -
          this.layerService.getBaseLayer().x() / oldScale,
        y:
          this.layerService.getStage().getPointerPosition().y / oldScale -
          this.layerService.getBaseLayer().y() / oldScale
      };

      var newScale = e.evt.deltaY < 0 ? oldScale + scaleBy : oldScale - scaleBy;
      newScale = Number.parseFloat(newScale.toFixed(1));
      if (newScale < 0.5) {
        newScale = 0.5;
      } else if (newScale > 5) {
        newScale = 5;
      }

      var newPos = {
        x: -(mousePointTo.x - this.layerService.getStage().getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - this.layerService.getStage().getPointerPosition().y / newScale) * newScale
      };

      // tend to 0,0
      if (newScale <= 1 && newScale > oldScale) {
        const steps = (2 * (1 - newScale)) / scaleBy + 1;
        newPos = {
          x: newPos.x - newPos.x / (newScale * steps),
          y: newPos.y - newPos.y / (newScale * steps)
        };
      } else if (newScale >= 1 && newScale < oldScale) {
        const steps = (2 * (newScale - 1)) / scaleBy + 1;
        newPos = {
          x: newPos.x - newPos.x / (newScale * steps),
          y: newPos.y - newPos.y / (newScale * steps)
        };
      }

      this.setZoom(newScale);
      this.scrollService.scroll(newPos);
    });
  }

  public removeWheelZoomListener(): void {
    this.layerService.getStage().off('wheel');
  }
}
