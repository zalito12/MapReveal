import { Injectable } from '@angular/core';

@Injectable()
export class AdminSettingsService {
  private enableDrawing = true;

  constructor() {}

  public setDrawingEnabled(isEnabled: boolean) {
    this.enableDrawing = isEnabled;
  }

  public isDrawingEnabled(): boolean {
    return this.enableDrawing;
  }
}
