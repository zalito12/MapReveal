import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public hidden: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public toggle() {
    this.hidden = !this.hidden;
  }
}
