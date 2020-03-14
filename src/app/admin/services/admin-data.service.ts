import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AdminDataService {
  private maps = new BehaviorSubject<any[]>([]);

  constructor() {}

  public getMaps$(): Observable<any[]> {
    return this.maps;
  }

  public addMapp(map: any) {
    const maps = this.maps.getValue().slice();
    maps.push(map);
    this.maps.next(maps);
  }
}
