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
  
  ngOnInit() {
  }

}
