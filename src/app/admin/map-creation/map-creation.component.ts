import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, HostListener } from '@angular/core';
import Konva from 'konva';
import { OnZoom } from '../../core/OnZoom';
import { Vector2d } from 'konva/types/types';
import { AdminSettingsService } from '../services/admin-settings.service';
import { ScrollService } from 'src/app/core/scroll.service';
import { OnScroll } from 'src/app/core/OnScroll';
import { LayerService } from 'src/app/core/layer.service';
import { GlobalSettingsService } from 'src/app/core/global-settings.service';
import { SpeakerService } from 'src/app/core/speaker.service';

@Component({
  selector: 'app-map-creation',
  templateUrl: './map-creation.component.html',
  styleUrls: ['./map-creation.component.css']
})
export class MapCreationComponent implements OnInit, OnDestroy, AfterViewInit, OnZoom, OnScroll {
  @Input('fileSrc') public fileSrc: string = null;

  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  private containerStartingSize = { width: 0, height: 0 };

  shapes: Konva.Shape[] = [];
  transformers: Konva.Transformer[] = [];

  private stage: Konva.Stage;
  private baseLayer = new Konva.Layer();
  private drawingLayer = new Konva.Layer();
  private roomLayer = new Konva.FastLayer();

  private mapStartigPos: Vector2d;

  private position: Vector2d;

  constructor(
    private speakerService: SpeakerService,
    private layerService: LayerService,
    private scrollService: ScrollService,
    private globalSettings: GlobalSettingsService,
    private adminSettings: AdminSettingsService
  ) {}

  ngOnInit() {
    this.speakerService.addZoomListener(this);
    this.speakerService.addScrollListener(this);
  }

  ngOnDestroy() {
    this.speakerService.removeZoomListener(this);
    this.speakerService.removeScrollListener(this);
  }

  ngAfterViewInit() {
    this.containerStartingSize = {
      width: this.container.nativeElement.offsetWidth,
      height: this.container.nativeElement.offsetHeight
    };
    this.stage = new Konva.Stage({
      container: 'stage',
      width: this.container.nativeElement.offsetWidth,
      height: this.container.nativeElement.offsetHeight
    });

    if (!this.fileSrc) {
      this.generateStage('/assets/images/dungeon.png');
    } else {
      this.generateStage(this.fileSrc);
    }
  }

  public generateStage(imageSrc: string) {
    Konva.Image.fromURL(imageSrc, dungeonNode => {
      const imageWidth = dungeonNode.attrs.image.width;
      const imageHeight = dungeonNode.attrs.image.height;
      const scale = this.computeScale(imageWidth, imageHeight);

      this.mapStartigPos = {
        x: imageWidth * scale < this.stage.width() ? (this.stage.width() - imageWidth * scale) / 2 : 0,
        y: imageHeight * scale < this.stage.height() ? (this.stage.height() - imageHeight * scale) / 2 : 0
      };
      dungeonNode.setAttrs({
        x: this.mapStartigPos.x,
        y: this.mapStartigPos.y,
        scaleX: scale,
        scaleY: scale
      });
      this.baseLayer.add(dungeonNode);

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

      this.stage.add(this.baseLayer);
      this.stage.add(this.roomLayer);
      this.stage.add(this.drawingLayer);

      this.baseLayer.batchDraw();
      this.drawingLayer.batchDraw();

      this.layerService.setStage(this.stage);
      this.layerService.setBaseLayer(this.baseLayer);
      this.layerService.setRoomLayer(this.roomLayer);
      this.layerService.setDrawingLayer(this.drawingLayer);

      this.scrollService.init();
      if (this.globalSettings.getScrollAction() === 'Zoom') {
        this.globalSettings.setWheelZoomListener();
      }

      this.fitStageIntoParentContainer();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.fitStageIntoParentContainer();
  }

  private fitStageIntoParentContainer() {
    // now we need to fit stage into parent
    var containerWidth = this.container.nativeElement.offsetWidth;
    var containerHeight= this.container.nativeElement.offsetHeight;
    // to do this we need to scale the stage
    var scale = Math.min(containerWidth / this.containerStartingSize.width, containerHeight / this.containerStartingSize.height);
    this.stage.width(this.containerStartingSize.width * scale);
    this.stage.height(this.containerStartingSize.height * scale);
    this.stage.scale({ x: scale, y: scale });
    this.stage.draw();
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
      var pos = this.getRelativePointerPosition(this.roomLayer);
      this.drawData.rect.width(pos.x - this.drawData.startX);
      this.drawData.rect.height(pos.y - this.drawData.startY);
      this.roomLayer.add(this.drawData.rect);
      this.roomLayer.batchDraw();

      this.shapes.push(this.getNormalizedDrawn(this.drawData.rect));
      this.drawData.rect = null;
    }
  }

  private getRelativePointerPosition(node) {
    // the function will return pointer position relative to the passed node
    var transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    var pos = node.getStage().getPointerPosition();

    // now we find relative point
    return transform.point(pos);
  }

  private bindDrawingEvent(drawingNode: Konva.Node) {
    drawingNode.on('mousedown touchstart', event => {
      if (this.drawing) {
        // we went out of box drawing so end now
        this.endDraw();
      } else if (this.adminSettings.isDrawingEnabled()) {
        this.drawing = true;
        var mousePos = this.getRelativePointerPosition(this.roomLayer);
        this.drawData.startX = mousePos.x;
        this.drawData.startY = mousePos.y;
      }
    });
    drawingNode.on('mouseup touchend', event => {
      if (this.drawing) {
        this.endDraw();
      }
    });
    drawingNode.on('mousemove touchmove', event => {
      if (this.drawing) {
        var pos = this.getRelativePointerPosition(this.roomLayer);
        if (!this.drawData.rect) {
          this.drawData.rect = new Konva.Rect({
            x: this.drawData.startX,
            y: this.drawData.startY,
            width: pos.x - this.drawData.startX,
            height: pos.y - this.drawData.startY,
            fill: '#FFFFFF99',
            stroke: '#424242',
            strokeWidth: 3
          });
        } else {
          this.drawData.rect.width(pos.x - this.drawData.startX);
          this.drawData.rect.height(pos.y - this.drawData.startY);
        }
        this.roomLayer.add(this.drawData.rect);
        this.roomLayer.batchDraw();
      }
    });
  }

  public onZoomChange(scale: number) {
    this.baseLayer.scaleX(scale);
    this.baseLayer.scaleY(scale);
    this.baseLayer.batchDraw();

    this.drawingLayer.scaleX(scale);
    this.drawingLayer.scaleY(scale);
    this.drawingLayer.batchDraw();

    this.redrawRooms();
  }

  public onScrollChange(position: Vector2d) {
    this.position = position;
    this.baseLayer.position(position);
    this.drawingLayer.position(position);
    this.baseLayer.batchDraw();
    this.drawingLayer.batchDraw();

    this.redrawRooms();
  }

  private redrawRooms() {
    const scale = this.globalSettings.getZoom();
    const offset = this.position;
    this.roomLayer.destroyChildren();
    this.shapes.forEach(shape => {
      const rect = shape.clone({
        width: shape.width() * scale,
        height: shape.height() * scale,
        x: shape.x() * scale + offset.x,
        y: shape.y() * scale + offset.y
      });
      this.roomLayer.add(rect);
    });
    this.roomLayer.batchDraw();
  }

  private getNormalizedDrawn(shape: Konva.Shape): Konva.Shape {
    const fixScale = 1 / this.globalSettings.getZoom();
    const offset = this.position;
    return shape.clone({
      width: this.drawData.rect.width() * fixScale,
      height: this.drawData.rect.height() * fixScale,
      x: this.drawData.rect.x() * fixScale - offset.x * fixScale,
      y: this.drawData.rect.y() * fixScale - offset.y * fixScale
    });
  }
}
