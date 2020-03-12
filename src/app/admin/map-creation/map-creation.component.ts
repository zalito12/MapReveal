import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import Konva from 'konva';
import { ShapeService } from '../../core/shape.service';
import { GlobalSettingsService } from '../../core/global-settings.service';
import { OnZoom } from '../../core/OnZoom';
import { Vector2d } from 'konva/types/types';
import { AdminSettingsService } from '../services/admin-settings.service';
import { ScrollService } from 'src/app/core/scroll.service';
import { OnScroll } from 'src/app/core/OnScroll';

@Component({
  selector: 'app-map-creation',
  templateUrl: './map-creation.component.html',
  styleUrls: ['./map-creation.component.css']
})
export class MapCreationComponent
  implements OnInit, OnDestroy, AfterViewInit, OnZoom, OnScroll {
  @ViewChild('container') container: ElementRef;

  shapes: Konva.Shape[] = [];
  transformers: Konva.Transformer[] = [];

  private stage: Konva.Stage;
  private baseLayer = new Konva.Layer();
  private drawingLayer: Konva.Layer;

  private mapStartigPos: Vector2d;

  constructor(
    private shapeService: ShapeService,
    private settings: GlobalSettingsService,
    private adminSettings: AdminSettingsService,
    private scroll: ScrollService
  ) {}

  ngOnInit() {
    this.settings.addListener(this);
    this.scroll.addListener(this);
  }

  ngOnDestroy() {
    this.settings.removeListener(this);
    this.scroll.removeListener(this);
  }

  ngAfterViewInit() {
    this.stage = new Konva.Stage({
      container: 'stage',
      width: this.container.nativeElement.offsetWidth,
      height: this.container.nativeElement.offsetHeight
    });
    this.stage.add(this.baseLayer);

    Konva.Image.fromURL('/assets/images/dungeon.png', dungeonNode => {
      console.log(dungeonNode);
      const imageWidth = dungeonNode.attrs.image.width;
      const imageHeight = dungeonNode.attrs.image.height;
      const scale = this.computeScale(imageWidth, imageHeight);
      this.mapStartigPos = {
        x:
          imageWidth * scale < this.stage.width()
            ? (this.stage.width() - imageWidth * scale) / 2
            : 0,
        y:
          imageHeight * scale < this.stage.height()
            ? this.stage.height() / 2
            : 0
      };
      dungeonNode.setAttrs({
        x: this.mapStartigPos.x,

        y: this.mapStartigPos.y,
        scaleX: scale,
        scaleY: scale
      });
      console.log(dungeonNode);
      this.baseLayer.add(dungeonNode);
      this.baseLayer.batchDraw();

      this.drawingLayer = new Konva.Layer();
      const rect = new Konva.Rect({
        x: this.mapStartigPos.x,
        y: this.mapStartigPos.y,
        width: imageWidth,
        height: imageHeight,
        scaleX: scale,
        scaleY: scale
      });

      this.bindDrawingEvent(rect);
      this.drawingLayer.add(rect);
      this.stage.add(this.drawingLayer);
      this.drawingLayer.batchDraw();

      this.scroll.init(this.stage);
      this.wheelZoom();
    });
  }

  private computeScale(imageWidth: number, imageHeight: number): number {
    const windowWidth = this.stage.width();
    const windowHeight = this.stage.height();
    let ratio = 1;
    if (windowWidth < windowHeight) {
      ratio = windowWidth / imageWidth;
    } else {
      ratio = windowHeight / imageHeight;
    }
    return ratio;
  }

  private drawing = false;
  private drawData = {
    rect: null,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    scale: 0
  };

  private endDraw() {
    this.drawing = false;
    if (this.drawData.rect) {
      var pos = this.stage.getPointerPosition();
      this.drawData.rect.width(pos.x - this.drawData.startX);
      this.drawData.rect.height(pos.y - this.drawData.startY);
      this.baseLayer.add(this.drawData.rect);
      this.baseLayer.batchDraw();
      this.drawData.rect = null;
    }
  }

  private bindDrawingEvent(drawingLayer: Konva.Node) {
    drawingLayer.on('mousedown touchstart', event => {
      if (this.drawing) {
        // we went out of box drawing so end now
        this.endDraw();
      } else if (this.adminSettings.isDrawingEnabled()) {
        this.drawing = true;
        var mousePos = this.stage.getPointerPosition();
        this.drawData.startX = mousePos.x;
        this.drawData.startY = mousePos.y;
      }
    });
    drawingLayer.on('mouseup touchend', event => {
      if (this.drawing) {
        this.endDraw();
      }
    });
    drawingLayer.on('mousemove touchmove', event => {
      if (this.drawing) {
        var pos = this.stage.getPointerPosition();
        if (!this.drawData.rect) {
          this.drawData.rect = new Konva.Rect({
            x: this.drawData.startX,
            y: this.drawData.startY,
            width: pos.x - this.drawData.startX,
            height: pos.y - this.drawData.startY,
            fill: '#FFFFFF99',
            stroke: '#424242',
            strokeWidth: 2
          });
        } else {
          this.drawData.rect.width(pos.x - this.drawData.startX);
          this.drawData.rect.height(pos.y - this.drawData.startY);
        }
        this.baseLayer.add(this.drawData.rect);
        this.baseLayer.batchDraw();
      }
    });
  }

  public onZoomChange(scale: number) {
    console.log(scale);
    this.baseLayer.scaleX(scale);
    this.baseLayer.scaleY(scale);
    this.baseLayer.batchDraw();
  }

  public onScrollChange(position: Vector2d) {
    console.log(position);
    this.baseLayer.x(-position.x);
    this.baseLayer.y(-position.y);
    this.baseLayer.batchDraw();
  }

  private wheelZoom(): void {
    const scaleBy = 0.1;
    this.stage.on('wheel', e => {
      e.evt.preventDefault();
      var oldScale = this.baseLayer.scaleX();

      var mousePointTo = {
        x:
          this.stage.getPointerPosition().x / oldScale -
          this.baseLayer.x() / oldScale,
        y:
          this.stage.getPointerPosition().y / oldScale -
          this.baseLayer.y() / oldScale
      };

      var newScale = e.evt.deltaY < 0 ? oldScale + scaleBy : oldScale - scaleBy;
      if (newScale < 0.5) {
        newScale = 0.5;
      } else if (newScale > 5) {
        newScale = 5;
      }

      var newPos = {
        x:
          -(mousePointTo.x - this.stage.getPointerPosition().x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - this.stage.getPointerPosition().y / newScale) *
          newScale
      };

      this.baseLayer.scale({ x: newScale, y: newScale });
      this.baseLayer.position(newPos);
      this.baseLayer.batchDraw();
      this.settings.setScale(newScale);
    });
  }
}
