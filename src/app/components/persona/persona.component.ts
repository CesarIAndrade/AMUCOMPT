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
    private tipoDocumentosService: TipoDocumentoService ) { }

  personas: Persona[] = [];
  consultarPersonas(){
    this.personaService.consultarPersonas()
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
    this.tipoDocumentosService.consultatTipoDocumentos()
      .subscribe(
        data => {
          this.tipoDocumentos = data.respuesta;
          console.log(data.respuesta);
        },
        err => console.log(err)
      )
  }

  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  crearPersona(){
    
  }

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumentos();
  }

}
