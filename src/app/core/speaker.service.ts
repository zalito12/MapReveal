import { OnZoom } from './OnZoom';
import { OnScroll } from './OnScroll';
import { Vector2d } from 'konva/types/types';
import { Injectable } from '@angular/core';

@Injectable()
export class SpeakerService {
  private scale: number = 1.0;
  private position: Vector2d = { x: 0, y: 0 };

  private zoomListeners: OnZoom[] = [];
  private scrollListeners: OnScroll[] = [];

  constructor() {}

  public updateZoom(scale: number) {
    this.scale = scale;
    this.zoomListeners.forEach(listener => {
      listener.onZoomChange(scale);
    });
  }

  public updateScroll(position: Vector2d) {
    this.position = position;
    this.scrollListeners.forEach(listener => {
      listener.onScrollChange(position);
    });
  }

  public addZoomListener(listener: OnZoom) {
    listener.onZoomChange(this.scale);
    this.addListener(this.zoomListeners, listener);
  }

  public addScrollListener(listener: OnScroll) {
    listener.onScrollChange(this.position);
    this.addListener(this.scrollListeners, listener);
  }

  public removeZoomListener(listener: OnZoom) {
    this.removeListener(this.zoomListeners, listener);
  }

  public removeScrollListener(listener: OnScroll) {
    this.removeListener(this.scrollListeners, listener);
  }

  private addListener<T>(list: T[], listener: T): void {
    const existingListener = list.indexOf(listener);
    if (existingListener !== -1) {
      list[existingListener] = listener;
    } else {
      list.push(listener);
    }
  }

  private removeListener<T>(list: T[], listener: T) {
    const existingListener = list.indexOf(listener);
    if (existingListener !== -1) {
      list.splice(existingListener, 1);
    }
  }
}
