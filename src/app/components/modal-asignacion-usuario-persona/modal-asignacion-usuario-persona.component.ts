import { Component, OnInit, Inject } from '@angular/core';
import { PersonaService } from 'src/app/services/persona.service';
import { Persona } from 'src/app/interfaces/persona/persona';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../usuario/usuario.component';

@Component({
  selector: 'app-modal-asignacion-usuario-persona',
  templateUrl: './modal-asignacion-usuario-persona.component.html',
  styleUrls: ['./modal-asignacion-usuario-persona.component.css']
})
export class ModalAsignacionUsuarioPersonaComponent implements OnInit {

  constructor(
    private personaService: PersonaService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  
  personas : Persona[] = [];
  filterPersona = '';

  asignarUsuarioaPersona(persona) {
    this.data.cedula = persona.NumeroDocumento;
    this.data.idPersona = persona.IdPersona;
    this.data.idUsuario = persona.IdUsuario; 
    this.data.nombres = persona.PrimerNombre +' '+ persona.SegundoNombre; 
    this.data.apellidos = persona.ApellidoPaterno +' '+ persona.ApellidoMaterno; 
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

}
