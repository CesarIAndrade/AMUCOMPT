import { Component, OnInit, Inject, ViewChild } from '@angular/core';

// Services
import { PersonaService } from "../../services/persona.service";

// Interfaces
import { Persona } from "../../interfaces/persona/persona";
import { TipoDocumento } from "../../interfaces/tipo-documento/tipo-documento";
import { Provincia } from 'src/app/interfaces/provincia/provincia';
import { Canton } from 'src/app/interfaces/canton/canton';
import { Parroquia } from 'src/app/interfaces/parroquia/parroquia';
import { Comunidad } from 'src/app/interfaces/comunidad/comunidad';
import { TipoTelefono } from 'src/app/interfaces/tipo-telefono/tipo-telefono';
import { Telefono } from 'src/app/interfaces/telefono/telefono';
import { PersonaModal } from "src/app/interfaces/persona/persona-modal";

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Components
import { ModalDetallePersonaComponent } from "src/app/components/modal-detalle-persona/modal-detalle-persona.component";

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor(
    private personaService: PersonaService,
    private dialog: MatDialog
  ) { }

  apellidos: string;
  arrayApellidos: any;
  arrayNombres: any;
  canton = '0';
  comunidad = '0';
  correo: string;
  idPersona: string;
  nombres: string;
  numeroDocumento: string;
  parroquia = '0';
  provincia = '0';
  telefono1: string;
  telefono2: string;
  tipoDocumento = "0";
  tipoTelefono1 = "0";
  tipoTelefono2 = "0";

  cantones: Canton[] = [];
  comunidades: Comunidad[] = [];
  parroquias: Parroquia[] = [];
  persona: PersonaModal = {};
  personas: Persona[] = [];
  provincias: Provincia[] = [];
  telefonos: Telefono[] = [];
  tipoDocumentos: TipoDocumento[] = [];
  tipoTelefonos: TipoTelefono[] = [];

  consultarProvincias() {
    this.personaService.consultarProvincias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.provincias = ok['respuesta'];
          console.log(this.provincias);
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarCantones() {
    this.personaService.consultarCantones(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
          console.log(this.cantones);
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarParroquias() {
    this.personaService.consultarParroquias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
          console.log(this.parroquias);
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarComunidades() {
    this.personaService.consultarComunidades(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.comunidades = ok['respuesta'];
          console.log(this.comunidades);
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarPersonas() {
    this.personaService.consultarPersonas(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.personas = ok['respuesta'];
          console.log(this.personas);
        },
        err => console.log(err)
      )
  }

  consultarTipoDocumento() {
    this.personaService.consultarTipoDocumento(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoDocumentos = ok['respuesta'];
          console.log(this.tipoDocumentos);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarTipoTelefono() {
    this.personaService.consultarTipoTelefono(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoTelefonos = ok['respuesta'];
          console.log(this.tipoTelefonos);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarCantonesDeUnaProvincia(idProvincia: string) {
    this.personaService.consultarCantonesDeUnaProvincia(idProvincia, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
          console.log(this.cantones);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarParroquiasDeUnCanton(idCanton: string) {
    this.personaService.consultarParroquiasDeUnCanton(idCanton, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
          console.log(this.parroquias);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarComunidadesDeUnaParroquia(idParroquia: string) {
    this.personaService.consultarComunidadesDeUnaParroquia(idParroquia, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.comunidades = ok['respuesta'];
          console.log(this.comunidades);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  crearPersona() {
    this.arrayNombres = this.nombres.split(" ");
    this.arrayApellidos = this.apellidos.split(" ");
    this.personaService.crearPersona(
      this.numeroDocumento,
      this.arrayApellidos[0],
      this.arrayApellidos[1],
      this.arrayNombres[0],
      this.arrayNombres[1],
      this.tipoDocumento,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          this.idPersona = ok['respuesta'];
          this.crearTelefono(this.idPersona);
          this.crearCorreo(this.idPersona);
          this.crearDireccion(this.idPersona);
          this.consultarPersonas();
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  crearTelefono(idPersona: string) {
    this.telefonos.push(
      {
        IdPersona: idPersona,
        Numero: this.telefono1,
        IdTipoTelefono: this.tipoTelefono1,
      },
      {
        IdPersona: idPersona,
        Numero: this.telefono2,
        IdTipoTelefono: this.tipoTelefono2,
      }
    )
    this.telefonos.map(
      item => {
        this.personaService.crearTelefono(
          item.IdPersona,
          item.Numero,
          item.IdTipoTelefono,
          localStorage.getItem('miCuenta.postToken'))
          .then(
            ok => {
              console.log(ok['respuesta']);
            },
          )
          .catch(
            err => {
              console.log(err);
            }
          )
      }
    )
  }

  crearCorreo(idPersona: string) {
    this.personaService.crearCorreo(
      idPersona,
      this.correo,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  crearDireccion(idPersona: string) {
    this.personaService.crearDireccion(
      idPersona,
      this.comunidad,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  cantonesDeUnaProvincia(value) {
    console.log(value);
    this.consultarCantonesDeUnaProvincia(value);
  }

  parroquiasDeUnCanton(value) {
    console.log(value);
    this.consultarParroquiasDeUnCanton(value);
  }

  comunidadesDeUnaParroquia(value) {
    console.log(value);
    this.consultarComunidadesDeUnaParroquia(value);
  }

  eliminarPersona(idPersona: string) {
    this.personaService.eliminarPersona(
      idPersona,
      localStorage.getItem('miCuenta.deleteToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
    this.consultarPersonas();
  }

  consultarPersonaPorId(idPersona: string){
    this.personaService.consultarPersonaPorId(
      idPersona,
      localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);

          this.persona.primerNombreModal = ok['respuesta']['PrimerNombre'];
          this.persona.segundoNombreModal = ok['respuesta']['SegundoNombre'];
          this.persona.apellidoPaternoModal = ok['respuesta']['ApellidoPaterno'];
          this.persona.apellidoMaternoModal = ok['respuesta']['ApellidoMaterno'];
          this.persona.tipoDocumentoModal = ok['respuesta']['TipoDocumento'];
          this.persona.numeroDocumentoModal = ok['respuesta']['NumeroDocumento'];
          try {
            this.persona.telefonoModal1 = ok['respuesta']['ListaTelefono'][0]['Numero'];
            this.persona.telefonoModal2 = ok['respuesta']['ListaTelefono'][1]['Numero'];
            this.persona.correoModal = ok['respuesta']['ListaCorreo'][0]['CorreoValor'];
            this.persona.comunidadModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Descripcion'];
            this.persona.parroquiaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Descripcion'];
            this.persona.cantonModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['Descripcion'];
            this.persona.provinciaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['Provincia']['Descripcion'];
          } catch (error) {
            this.persona.telefonoModal1 = null;
            this.persona.telefonoModal2 = null;
            this.persona.correoModal = null;
            this.persona.comunidadModal = null;
            this.persona.parroquiaModal = null;
            this.persona.cantonModal = null;
            this.persona.provinciaModal = null;
          }
          this.abrirModal(this.persona)
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  abrirModal(
    persona: PersonaModal
  ) {
    let dialogRef = this.dialog.open(ModalDetallePersonaComponent, {
      width: '500px',
      height: '500px',
      data: {
        primerNombreModal: persona.primerNombreModal,
        segundoNombreModal: persona.segundoNombreModal,
        apellidoPaternoModal: persona.apellidoPaternoModal,
        apellidoMaternoModal: persona.apellidoMaternoModal,
        tipoDocumentoModal: persona.tipoDocumentoModal,
        numeroDocumentoModal: persona.numeroDocumentoModal,
        telefonoModal1: this.persona.telefonoModal1,
        telefonoModal2: this.persona.telefonoModal2,
        correoModal: this.persona.correoModal,
        comunidadModal: this.persona.comunidadModal,
        parroquiaModal: this.persona.parroquiaModal,
        cantonModal: this.persona.cantonModal,
        provinciaModal: this.persona.provinciaModal
      }
    });
    dialogRef.afterClosed().subscribe(
      ok => {
        console.log(`Result: ${ok}`);
      }
    )
  }

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
  }

}
