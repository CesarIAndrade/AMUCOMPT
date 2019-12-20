import { Component, OnInit } from '@angular/core';

// Services
import { PersonaService } from "../../services/persona.service";
import { TipoDocumentoService } from "../../services/tipo-documento.service";

// Interfaces
import { Persona } from "../../interfaces/persona/persona";
import { TipoDocumentos } from "../../interfaces/tipo-documento/tipo-documento";

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor(
    private personaService: PersonaService,
    private tipoDocumentoService: TipoDocumentoService ) { }

  apellidos: string;
  correo: string;
  direccion: string;
  nombres: string;
  numeroDocumento: string;
  personas: Persona[] = [];
  telefono: string;
  tipoDocumento: string = "0";

  consultarPersonas(){
    this.personaService.consultarPersonas(localStorage.getItem('miCuenta.getToken'))
      .subscribe(
        data => {
          this.personas = data.respuesta;
          console.log(data.respuesta);
        },
        err => console.log(err)
      )
  }

  tipoDocumentos: TipoDocumentos[] = [];
  consultarTipoDocumentos(){
    this.tipoDocumentoService.consultatTipoDocumentos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoDocumentos = ok['respuesta'];
          console.log(ok['respuesta']);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  crearPersona(){
    console.log(this.tipoDocumento);
    
    
    this.consultarPersonas();
  }

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumentos();
  }

}
