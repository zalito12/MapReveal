import { Injectable } from '@angular/core';
import Konva from 'konva';
import { Vector2d } from 'konva/types/types';
import { OnZoom } from './OnZoom';
import { OnScroll } from './OnScroll';
import { GlobalSettingsService } from './global-settings.service';
import { LayerService } from './layer.service';
import { SpeakerService } from './speaker.service';

const COLOR = 'grey';
const OPACITY = 0.7;
const PADDING = 2;
const SIZE = 12;
const MIN_BAR_SIZE = 80;
const PRECISION = 0.01;

@Injectable()
export class ScrollService implements OnZoom {
  private guiLayer: Konva.Layer;
  private verticalBar: Konva.Rect;
  private horizontalBar: Konva.Rect;

  private scale: number = 1.0;
  private offset: Vector2d = { x: 0, y: 0 };

  constructor(private speakerService: SpeakerService, private layerService: LayerService) {}

  onZoomChange(scale: number) {
    this.scale = scale;
    this.updateBarsSize(scale);
    if (scale === 1) {
      this.scrollOnDrag({ x: 0, y: 0 });
    }
  }

  private getBarsSize(scale: number): Vector2d {
    if (scale - 1 < PRECISION) {
      return null;
    }

    const width = Math.max(this.layerService.getStage().width() / scale, MIN_BAR_SIZE);
    const height = Math.max(this.layerService.getStage().height() / scale, MIN_BAR_SIZE);

    return { x: width, y: height };
  }

  private hideBars(): void {
    this.verticalBar.hide();
    this.horizontalBar.hide();
    this.guiLayer.batchDraw();
  }

  private showBars(): void {
    this.verticalBar.show();
    this.horizontalBar.show();
    this.guiLayer.batchDraw();
  }

  private updateBarsSize(scale: number) {
    const sizes = this.getBarsSize(scale);
    if (!sizes) {
      this.hideBars();
      return;
    }

    this.horizontalBar.width(sizes.x);
    this.verticalBar.height(sizes.y);
    this.updateBarsPosition(this.offset);
    this.showBars();
  }

  public scroll(position: Vector2d): void {
    this.scrollOnDrag(position);
    this.updateBarsPosition(position);
  }

  private updateBarsPosition(position: Vector2d) {
    const availableWidth = this.layerService.getStage().width() - PADDING * 2 - this.horizontalBar.width();
    const availableHeight = this.layerService.getStage().height() - PADDING * 2 - this.verticalBar.height();
    const maxWidth = this.layerService.getStage().width() * this.scale;
    const maxHeight = this.layerService.getStage().height() * this.scale;
    const propw = (1 + maxWidth - this.layerService.getStage().width()) / availableWidth; // +1 to not be equal to 0
    const proph = (1 + maxHeight - this.layerService.getStage().height()) / availableHeight; // +1 to not be equal to 0

    this.horizontalBar.x(-position.x / propw + PADDING);
    this.verticalBar.y(-position.y / proph + PADDING);
    this.guiLayer.batchDraw();
  }

  private scrollOnDrag(position: Vector2d) {
    this.offset = position;
    this.speakerService.updateScroll(position);
  }

  public init() {
    if (!this.guiLayer) {
      this.guiLayer = new Konva.Layer();
      this.layerService.getStage().add(this.guiLayer);
      this.layerService.setGuiLayer(this.guiLayer);
    }

    this.verticalBar = new Konva.Rect({
      width: SIZE,
      height: MIN_BAR_SIZE,
      fill: COLOR,
      opacity: OPACITY,
      x: this.layerService.getStage().width() - PADDING - SIZE,
      y: PADDING,
      draggable: true,
      dragBoundFunc: pos => {
        pos.x = this.layerService.getStage().width() - PADDING - SIZE;
        pos.y = Math.max(
          Math.min(pos.y, this.layerService.getStage().height() - this.verticalBar.height() - PADDING),
          PADDING
        );
        return pos;
      }
    });

    this.horizontalBar = new Konva.Rect({
      width: MIN_BAR_SIZE,
      height: SIZE,
      fill: COLOR,
      opacity: OPACITY,
      x: PADDING,
      y: this.layerService.getStage().height() - PADDING - SIZE,
      draggable: true,
      dragBoundFunc: pos => {
        pos.x = Math.max(
          Math.min(pos.x, this.layerService.getStage().width() - this.horizontalBar.width() - PADDING),
          PADDING
        );
        pos.y = this.layerService.getStage().height() - PADDING - SIZE;
        return pos;
      }
    });

    this.verticalBar.on('dragmove', () => this.dragEventListener());
    this.horizontalBar.on('dragmove', () => this.dragEventListener());

    this.guiLayer.add(this.verticalBar);
    this.guiLayer.add(this.horizontalBar);
    this.updateBarsSize(this.scale);
    this.guiLayer.batchDraw();

    this.speakerService.addZoomListener(this);
  }

  private dragEventListener(): void {
    // delta in %
    const availableWidth = this.layerService.getStage().width() - PADDING * 2 - this.horizontalBar.width();
    const delta = (this.horizontalBar.x() - PADDING) / availableWidth;

    const position =
      Math.max(0, this.layerService.getStage().width() * this.scale - this.layerService.getStage().width()) * delta;

    const availableHeight = this.layerService.getStage().height() - PADDING * 2 - this.verticalBar.height();
    const deltay = (this.verticalBar.y() - PADDING) / availableHeight;

    const positiony =
      Math.max(0, this.layerService.getStage().height() * this.scale - this.layerService.getStage().height()) * deltay;

    this.scrollOnDrag({ x: -position, y: -positiony });
  }
}
