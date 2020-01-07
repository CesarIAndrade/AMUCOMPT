import { Component, OnInit, Inject } from '@angular/core';

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

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor(
    private personaService: PersonaService
  ) { }

  apellidos: string;
  arrayApellidos: any;
  arrayNombres: any;
  // botonAgregarNumero = false;
  canton = '0';
  comunidad = '0';
  correo: string;
  idPersona: string;
  nombres: string;
  numeroDocumento: string;
  // numeroExtra = true;
  parroquia = '0';
  provincia = '0';
  telefono1: string;
  telefono2: string;
  // telefono3: string;
  tipoDocumento = "0";
  tipoTelefono1 = "0";
  tipoTelefono2 = "0";

  cantones: Canton[] = [];
  comunidades: Comunidad[] = [];
  parroquias: Parroquia[] = [];
  personas: Persona[] = [];
  provincias: Provincia[] = [];
  telefonos: Telefono[] = [];
  tipoDocumentos: TipoDocumento[] = [];
  tipoTelefonos: TipoTelefono[] = [];

  // agregarTelefono() {
  //   console.log('worked');
  //   if (this.numeroExtra == true) {
  //     this.numeroExtra = false;
  //     this.botonAgregarNumero = true;
  //   }
  // }

  // quitarTelefono() {
  //   console.log('worked');
  //   if (this.numeroExtra == false) {
  //     this.numeroExtra = true;
  //     this.botonAgregarNumero = false;
  //   }
  // }

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

  crearDireccion(idPersona: string){
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

  eliminarPersona(idPersona: string){
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

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
  }

}
