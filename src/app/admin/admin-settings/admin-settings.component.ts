import { Component, OnInit, OnDestroy } from "@angular/core";
import { AdminSettingsService } from '../services/admin-settings.service';
import { OnZoom } from '../services/OnZoom';

@Component({
  selector: "app-admin-settings",
  templateUrl: "./admin-settings.component.html",
  styleUrls: ["./admin-settings.component.css"]
})
export class AdminSettingsComponent implements OnInit, OnDestroy, OnZoom {

  public drawDisabled: boolean;

  public zoom: number;

  constructor(private settings: AdminSettingsService) {}

  ngOnInit(): void {
    this.drawDisabled = !this.settings.isDrawingEnabled();
    this.zoom = this.settings.getScale();
    this.settings.addZoomListener(this);
  }

  ngOnDestroy(): void {
    this.settings.removeZoomListener(this);
  }


  public onChange(): void {
    this.settings.setDrawingEnabled(!this.drawDisabled);
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
