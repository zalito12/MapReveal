import { Vector2d } from 'konva/types/types';
import { Listener } from './listener';

export interface OnScroll extends Listener {
  onScrollChange(position: Vector2d);
}
