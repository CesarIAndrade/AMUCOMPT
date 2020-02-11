import { Component, OnInit, Inject } from '@angular/core';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-modal-asignacion-usuario-persona',
  templateUrl: './modal-asignacion-usuario-persona.component.html',
  styleUrls: ['./modal-asignacion-usuario-persona.component.css']
})
export class ModalAsignacionUsuarioPersonaComponent implements OnInit {

  constructor(
    private personaService: PersonaService,
  ) { }
  
  personas : any[] = [];
  filterPersona = '';

  datosPersona = {
    cedula: '',
    idPersona: '',
    nombres: '',
    apellidos: '',
  }

  asignarUsuarioaPersona(persona) {
    this.datosPersona.cedula = persona.NumeroDocumento;
    this.datosPersona.idPersona = persona.IdPersona;
    this.datosPersona.nombres = persona.PrimerNombre +' '+ persona.SegundoNombre; 
    this.datosPersona.apellidos = persona.ApellidoPaterno +' '+ persona.ApellidoMaterno; 
  }

  consultarPersonas() {
    this.personaService.consultarPersonasSinUsuario(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.personas = ok['respuesta'];
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  ngOnInit() {
    this.consultarPersonas();
  }

  tablaPersonas = ['nombres', 'apellidos', 'documento', 'numeroDocumento', 'acciones'];

}
