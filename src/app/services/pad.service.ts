import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pad } from '../Pad'
import { PADS } from '../mock-pads';

@Injectable({
  providedIn: 'root'
})
export class PadService {

  constructor() { }

  getPads() : Observable<Pad[]> {
    const pads = of(PADS);
    return pads;
  }
}
