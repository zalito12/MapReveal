import { Injectable } from "@angular/core";
import { OnZoom } from "./OnZoom";

@Injectable({
  providedIn: "root"
})
export class AdminSettingsService {
  private enableDrawing = true;

  private scale = 1.0;
  public zoomListeners: OnZoom[] = [];

  constructor() {}

  public setScale(scale: number) {
    this.scale = scale;
    if (this.zoomListeners.length > 0) {
      this.zoomListeners.forEach(listener => listener.onZoomChange(this.scale));
    }
  }

  public getScale(): number {
    return this.scale;
  }

  public setDrawingEnabled(isEnabled: boolean) {
    this.enableDrawing = isEnabled;
  }

  public isDrawingEnabled(): boolean {
    return this.enableDrawing;
  }

  public addZoomListener(listener: OnZoom) {
    const existingListener = this.zoomListeners.indexOf(listener);
    if (existingListener != -1) {
      this.zoomListeners[existingListener] = listener;
    } else {
      this.zoomListeners.push(listener);
    }
  }

  public removeZoomListener(listener: OnZoom) {
    const existingListener = this.zoomListeners.indexOf(listener);
    if (existingListener != -1) {
      this.zoomListeners.splice(existingListener, 1);
    }
  }
}
