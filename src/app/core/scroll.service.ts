import { Injectable } from '@angular/core';
import Konva from 'konva';
import { GlobalSettingsService } from './global-settings.service';
import { Vector2d } from 'konva/types/types';
import { OnZoom } from './OnZoom';
import { SpeakerService } from './speaker-service';
import { OnScroll } from './OnScroll';

const COLOR = 'grey';
const OPACITY = 0.7;
const PADDING = 2;
const SIZE = 10;
const MIN_BAR_SIZE = 80;
const PRECISION = 0.01;

@Injectable()
export class ScrollService extends SpeakerService<OnScroll> implements OnZoom {
  private stage: Konva.Stage;
  private guiLayer: Konva.Layer;
  private verticalBar: Konva.Rect;
  private horizontalBar: Konva.Rect;

  private scrollListeners: OnScroll[] = [];

  constructor(private settings: GlobalSettingsService) {
    super();
    this.settings.addListener(this);
  }

  public getListeners(): OnScroll[] {
    return this.scrollListeners;
  }

  public onZoomChange(scale: number) {
    this.updateBarsSize(scale);
  }

  private getBarsSize(scale: number): Vector2d {
    if (scale - 1 < PRECISION) {
      return null;
    }

    const width = Math.max(this.stage.width() / scale, MIN_BAR_SIZE);
    const height = Math.max(this.stage.height() / scale, MIN_BAR_SIZE);

    return { x: width, y: height };
  }

  private hideBars(): void {
    this.verticalBar.hide();
    this.horizontalBar.hide();
    this.guiLayer.draw();
  }

  private showBars(): void {
    this.verticalBar.show();
    this.horizontalBar.show();
    this.guiLayer.draw();
  }

  private updateBarsSize(scale: number) {
    const sizes = this.getBarsSize(scale);
    console.log(sizes);
    if (!sizes) {
      this.hideBars();
      return;
    }

    this.horizontalBar.width(sizes.x);
    this.verticalBar.height(sizes.y);
    this.showBars();
  }

  private scroll(position: Vector2d): void {
    this.scrollListeners.forEach(listener => {
      listener.onScrollChange(position);
    });
  }

  public init(stage: Konva.Stage) {
    this.stage = stage;
    if (!this.guiLayer) {
      this.guiLayer = new Konva.Layer();
      this.stage.add(this.guiLayer);
    }

    this.verticalBar = new Konva.Rect({
      width: SIZE,
      height: MIN_BAR_SIZE,
      fill: COLOR,
      opacity: OPACITY,
      x: this.stage.width() - PADDING - SIZE,
      y: PADDING,
      draggable: true,
      dragBoundFunc: pos => {
        pos.x = this.stage.width() - PADDING - SIZE;
        pos.y = Math.max(
          Math.min(pos.y, this.stage.height() - this.verticalBar.height() - PADDING),
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
      y: this.stage.height() - PADDING - SIZE,
      draggable: true,
      dragBoundFunc: pos => {
        pos.x = Math.max(
          Math.min(pos.x, this.stage.width() - this.horizontalBar.width() - PADDING),
          PADDING
        );
        pos.y = this.stage.height() - PADDING - SIZE;
        return pos;
      }
    });

    this.verticalBar.on('dragmove', () => this.dragEventListener());
    this.horizontalBar.on('dragmove', () => this.dragEventListener());

    this.guiLayer.add(this.verticalBar);
    this.guiLayer.add(this.horizontalBar);
    this.updateBarsSize(this.settings.getScale());
    this.guiLayer.draw();
  }

  private dragEventListener(): void {
    // delta in %
    const availableWidth =
      this.stage.width() - PADDING * 2 - this.horizontalBar.width();
    const delta = (this.horizontalBar.x() - PADDING) / availableWidth;

    const position =
      Math.max(
        0,
        this.stage.width() * this.settings.getScale() - this.stage.width()
      ) * delta;

    const availableHeight =
      this.stage.height() - PADDING * 2 - this.verticalBar.height();
    const deltay = (this.verticalBar.y() - PADDING) / availableHeight;

    const positiony =
      Math.max(
        0,
        this.stage.height() * this.settings.getScale() - this.stage.height()
      ) * deltay;

    this.scroll({ x: position, y: positiony });
  }
}
