import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalSettingsService } from 'src/app/core/global-settings.service';
import { OnZoom } from 'src/app/core/OnZoom';
import { AdminSettingsService } from '../services/admin-settings.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit, OnDestroy, OnZoom {
  public drawDisabled: boolean;

  public zoom: number;

  constructor(
    private settings: GlobalSettingsService,
    private adminSettings: AdminSettingsService
  ) {}

  ngOnInit(): void {
    this.drawDisabled = !this.adminSettings.isDrawingEnabled();
    this.zoom = this.settings.getScale();
    this.settings.addListener(this);
  }

  ngOnDestroy(): void {
    this.settings.removeListener(this);
  }

  public onChange(): void {
    this.adminSettings.setDrawingEnabled(!this.drawDisabled);
  }

  public onChangeZoom(zoom: number): void {
    this.settings.setScale(zoom);
  }

  public zoomOut(): void {
    this.zoom = Math.max(0, this.zoom - 0.1);
    this.onChangeZoom(this.zoom);
  }

  public zoomIn(): void {
    this.zoom = Math.min(5, this.zoom + 0.1);
    this.onChangeZoom(this.zoom);
  }

  public onZoomChange(scale: number) {
    this.zoom = scale;
  }
}
