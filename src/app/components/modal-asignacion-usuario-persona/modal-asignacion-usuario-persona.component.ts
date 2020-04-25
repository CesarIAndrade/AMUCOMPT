import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { PersonaService } from 'src/app/services/persona.service';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-asignacion-usuario-persona',
  templateUrl: './modal-asignacion-usuario-persona.component.html',
  styleUrls: ['./modal-asignacion-usuario-persona.component.css']
})
export class ModalAsignacionUsuarioPersonaComponent implements OnInit {

  constructor(
    private personaService: PersonaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  personas = new MatTableDataSource<Element[]>();
  //personas : any[] = [];
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
          this.personas.data = ok['respuesta'];
          this.personas.paginator = this.paginator;
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }
  consultarPersonasTodas() {
    this.personaService.consultarPersonas(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.personas.data = ok['respuesta'];
          this.personas.paginator = this.paginator;
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }
  ngOnInit() {
    if(this.data == 'todos'){
      this.consultarPersonasTodas();
    }else{
      this.consultarPersonas();
    }
  }

  tablaPersonas = ['nombres', 'apellidos', 'documento', 'numeroDocumento', 'acciones'];

}
