import { Listener } from './listener';

export abstract class SpeakerService<T extends Listener> {
  public abstract getListeners(): T[];

  public addListener(listener: T) {
    const existingListener = this.getListeners().indexOf(listener);
    if (existingListener !== -1) {
      this.getListeners()[existingListener] = listener;
    } else {
      this.getListeners().push(listener);
    }
  }

  public removeListener(listener: T) {
    const existingListener = this.getListeners().indexOf(listener);
    if (existingListener !== -1) {
      this.getListeners().splice(existingListener, 1);
    }
  }
}
