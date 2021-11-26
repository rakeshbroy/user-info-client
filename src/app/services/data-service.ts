import {EventEmitter, Injectable, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class DataService {
  constructor() { }

  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

}