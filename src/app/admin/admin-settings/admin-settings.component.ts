import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnZoom } from 'src/app/core/OnZoom';
import { AdminSettingsService } from '../services/admin-settings.service';
import { GlobalSettingsService } from 'src/app/core/global-settings.service';
import { SpeakerService } from 'src/app/core/speaker.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit, OnDestroy, OnZoom {
  public drawDisabled: boolean;

  public zoom: number;
  public zoomStep: number;
  public zoomMax: number;
  public zoomMin: number;

  public zoomOnScroll: boolean;

  constructor(
    private speakerService: SpeakerService,
    private globalSettings: GlobalSettingsService,
    private adminSettings: AdminSettingsService
  ) {}

  ngOnInit(): void {
    this.drawDisabled = !this.adminSettings.isDrawingEnabled();
    this.zoom = this.globalSettings.getZoom();
    this.zoomStep = this.globalSettings.getZoomStep();
    this.zoomMin = this.globalSettings.getMinZoom();
    this.zoomMax = this.globalSettings.getMaxZoom();
    this.zoomOnScroll = this.globalSettings.getScrollAction() === 'Zoom';
    this.speakerService.addZoomListener(this);
  }

  ngOnDestroy(): void {
    this.speakerService.removeZoomListener(this);
  }

  public onChange(): void {
    this.adminSettings.setDrawingEnabled(!this.drawDisabled);
    this.globalSettings.setScrollAction(this.zoomOnScroll ? 'Zoom' : 'Scroll');
  }

  public onChangeZoom(zoom: number): void {
    this.globalSettings.setZoom(zoom);
  }

  public zoomOut(): void {
    this.onChangeZoom(Math.max(this.zoomMin, this.zoom - this.zoomStep));
  }

  public zoomIn(): void {
    this.onChangeZoom(Math.min(this.zoomMax, this.zoom + this.zoomStep));
  }

  public zoomReset(): void {
    this.onChangeZoom(1.0);
  }

  public onZoomChange(scale: number) {
    this.zoom = scale;
  }
}
