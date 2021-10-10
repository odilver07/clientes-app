import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent{

  listaCurso: string[] = ['typeScript', 'JavaScript', 'C#', 'Java SE', 'Python']
 
 habilitar: boolean = true;

  setHabilitar(): void{
    this.habilitar = (this.habilitar)? false : true
  }
  constructor() { }
}
