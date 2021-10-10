import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _notificarUpload =  new EventEmitter<any>();
  
  constructor() { }

  get notificarUpload(): EventEmitter<any>{
    return this._notificarUpload;
  }
}
