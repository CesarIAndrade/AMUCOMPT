import { Component, OnInit, ViewChild } from '@angular/core';
import { ProvinciaComponent } from '../provincia/provincia.component';
import { CantonComponent } from '../canton/canton.component';
import { ParroquiaComponent } from '../parroquia/parroquia.component';
import { ComunidadComponent } from '../comunidad/comunidad.component';
import { SembrioComponent } from '../sembrio/sembrio.component';
@Component({
  selector: 'app-panel-administracion',
  templateUrl: './panel-administracion.component.html',
  styleUrls: ['./panel-administracion.component.css']
})
export class PanelAdministracionComponent implements OnInit {

  constructor() { }

  @ViewChild(ProvinciaComponent, {static: false}) tabProvincia: ProvinciaComponent;
  @ViewChild(CantonComponent, {static: false}) tabCanton: CantonComponent;
  @ViewChild(ParroquiaComponent, {static: false}) tabParroquia: ParroquiaComponent;
  @ViewChild(ComunidadComponent, {static: false}) tabComunidad: ComunidadComponent;
  @ViewChild(SembrioComponent, {static: false}) tabSembrio: SembrioComponent;

  verificarNuevaProvinciaCreada(event) {
    if(event) {
      this.tabCanton.ngOnInit();
    }
  }

  verificarNuevoCantonCreado(event) {
    if(event) {
      this.tabParroquia.ngOnInit();
    }
  }

  verificarNuevaParroquiaCreada(event) {
    if(event) {
      this.tabComunidad.ngOnInit();
    }
  }

  verificarNuevaComunidadCreada(event) {
    if(event) {
      this.tabSembrio.ngOnInit();
    }
  }

  verificarNuevoSembrioCreado(event) {
    console.log(event);
  }

  ngOnInit() {
  }

}
