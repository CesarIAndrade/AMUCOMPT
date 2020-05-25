import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';

@Component({
  selector: 'app-asignar-tecnico-cliente',
  templateUrl: './asignar-tecnico-cliente.component.html',
  styleUrls: ['./asignar-tecnico-cliente.component.css']
})
export class AsignarTecnicoClienteComponent implements OnInit {

  constructor(
    private panelAdministracionService: PanelAdministracionService
  ) { 
    this.myForm = new FormGroup({
      _canton: new FormControl("")
    })
   }

  myForm: FormGroup;
  cantones: any[] = [];
  parroquias: any[] = [];
  comunidades: any[] = [];

  consultarCantones() {
    this.panelAdministracionService.consultarCantones(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = [];
          this.cantones = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  selecionarCanton(canton) {

  }

  ngOnInit() {
  }

  tablaCantones = ['canton', 'provincia', 'acciones'];

}
