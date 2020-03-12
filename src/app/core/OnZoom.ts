import { Listener } from './listener';

export interface OnZoom extends Listener {
  onZoomChange(scale: number);
}
