import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable()
export class LayerService {
  private stage: Konva.Stage;
  private baseLayer: Konva.Layer;
  private roomLayer: Konva.FastLayer;
  private drawingLayer: Konva.Layer;
  private guiLayer: Konva.Layer;

  constructor() {}

  public getStage(): Konva.Stage {
    return this.stage;
  }

  public setStage(stage: Konva.Stage): void {
    this.stage = stage;
  }

  public getBaseLayer(): Konva.Layer {
    return this.baseLayer;
  }

  public setBaseLayer(baseLayer: Konva.Layer): void {
    this.baseLayer = baseLayer;
  }

  public getRoomLayer(): Konva.FastLayer {
    return this.roomLayer;
  }

  public setRoomLayer(roomLayer: Konva.FastLayer): void {
    this.roomLayer = roomLayer;
  }

  public getDrawingLayer(): Konva.Layer {
    return this.drawingLayer;
  }

  public setDrawingLayer(drawingLayer: Konva.Layer): void {
    this.drawingLayer = drawingLayer;
  }

  public getGuiLayer(): Konva.Layer {
    return this.guiLayer;
  }

  public setGuiLayer(guiLayer: Konva.Layer): void {
    this.guiLayer = guiLayer;
  }
}
