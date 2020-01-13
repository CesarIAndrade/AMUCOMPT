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
  ) {
    console.log(this.data);
  }
  personas : Persona[] = [];
  Cedula : string;
  idPersona : string;
  filterPersona = '';
  asignarUsuarioaPersona(idPersona: string,numeroDocumento: string)
  {
    this.data.cedula = numeroDocumento;
    this.data.idPersona= idPersona;
  }


  consultarPersonas() {
    this.personaService.consultarPersonasSinUsuario(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.personas = ok['respuesta'];
          console.log(this.personas);
        },
        err => console.log(err)
      )
  }

  ngOnInit() {
    this.consultarPersonas();
  }

}
