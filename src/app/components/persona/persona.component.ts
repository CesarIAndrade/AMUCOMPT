import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

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

  myForm: FormGroup;

  constructor(
    private personaService: PersonaService,
    private dialog: MatDialog,
    public fb: FormBuilder
  ) {
    this.myForm = new FormGroup({
      _nombres: new FormControl('', [Validators.required]),
      _apellidos: new FormControl('', [Validators.required]),
      _tipoDocumento: new FormControl('', [Validators.required]),
      _numeroDocumento: new FormControl('', [Validators.required]),
      _telefono1: new FormControl('', [Validators.required]),
      _tipoTelefono1: new FormControl('', [Validators.required]),
      _telefono2: new FormControl('', [Validators.required]),
      _tipoTelefono2: new FormControl('', [Validators.required]),
      _correo: new FormControl('', [Validators.required]),
    });
  }

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
  personaModal: PersonaModal = {};
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

  consultarCantonesDeUnaProvincia(idProvincia: string, value: string) {
    this.personaService.consultarCantonesDeUnaProvincia(idProvincia, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
          console.log(this.cantones);
          if (value == 'ingresar') {
            this.parroquias = null;
            this.comunidades = null;
            this.canton = '0';
            this.parroquia = '0';
            this.comunidad = '0';
          }
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarParroquiasDeUnCanton(idCanton: string, value: string) {
    this.personaService.consultarParroquiasDeUnCanton(idCanton, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
          console.log(this.parroquias);
          if (value == 'ingresar') {
            this.comunidades = null;
            this.parroquia = '0';
            this.comunidad = '0';
          }
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarComunidadesDeUnaParroquia(idParroquia: string, value: string) {
    this.personaService.consultarComunidadesDeUnaParroquia(idParroquia, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.comunidades = ok['respuesta'];
          console.log(this.comunidades);
          if (value == 'ingresar') {
            this.comunidad = '0';
          }
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  onChange(value) {
    console.log(value.target.value)

  }

  validarCampos(
    tipoDocumento: string,
    tipoTelefono1: string,
    tipoTelefono2: string,
    provincia: string,
    canton: string,
    parroquia: string,
    comunidad: string
  ) {
    if (tipoDocumento == "0") {
      console.log("Campo Requerido");
      this.campoRequerido = false;
    } else if (tipoTelefono1 == "0") {
      console.log("Campo Requerido");
      this.campoRequerido = false;
    } else if (tipoTelefono2 == "0") {
      console.log("Campo Requerido");
      this.campoRequerido = false;
    } else if (provincia == "0") {
      console.log("Campo Requerido");
      this.campoRequerido = false;
    } else if (canton == "0") {
      console.log("Campo Requerido");
      this.campoRequerido = false;
    } else if (parroquia == "0") {
      console.log("Campo Requerido");
      this.campoRequerido = false;
    } else if (comunidad == "0") {
      console.log("Campo Requerido");
      this.campoRequerido = false;
    }
  }

  campoRequerido = true;

  validarFormulario() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      this.crearPersona();
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearPersona() {
    console.log("Todo Bien");
    // this.validarCampos(
    //   this.nombres, this.apellidos,
    //   this.tipoDocumento, this.numeroDocumento,
    //   this.telefono1, this.tipoTelefono1,
    //   this.telefono2, this.tipoTelefono2,
    //   this.correo, this.provincia, this.canton,
    //   this.parroquia, this.comunidad
    // );
    // this.arrayNombres = this.nombres.split(" ");
    // this.arrayApellidos = this.apellidos.split(" ");
    // this.personaService.crearPersona(
    //   this.numeroDocumento,
    //   this.arrayApellidos[0],
    //   this.arrayApellidos[1],
    //   this.arrayNombres[0],
    //   this.arrayNombres[1],
    //   this.tipoDocumento,
    //   localStorage.getItem('miCuenta.postToken'))
    //   .then(
    //     ok => {
    //       console.log(ok['respuesta']);
    //       this.idPersona = ok['respuesta'];
    //       // this.crearTelefono(this.idPersona);
    //       // this.crearCorreo(this.idPersona);
    //       // this.crearDireccion(this.idPersona);
    //       this.consultarPersonas();
    //     },
    //   )
    //   .catch(
    //     err => {
    //       console.log(err);
    //     }
    //   )
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
    this.consultarCantonesDeUnaProvincia(value, 'ingresar');
  }

  parroquiasDeUnCanton(value) {
    console.log(value);
    this.consultarParroquiasDeUnCanton(value, 'ingresar');
  }

  comunidadesDeUnaParroquia(value) {
    console.log(value);
    this.consultarComunidadesDeUnaParroquia(value, 'ingresar');
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

  consultarPersonaPorId(
    value: string,
    idPersona: string,
  ) {
    this.personaService.consultarPersonaPorId(
      idPersona,
      localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.personaModal.primerNombreModal = ok['respuesta']['PrimerNombre'];
          this.personaModal.segundoNombreModal = ok['respuesta']['SegundoNombre'];
          this.personaModal.apellidoPaternoModal = ok['respuesta']['ApellidoPaterno'];
          this.personaModal.apellidoMaternoModal = ok['respuesta']['ApellidoMaterno'];
          this.personaModal.idTipoDocumentoModal = ok['respuesta']['IdTipoDocumento'];
          this.personaModal.tipoDocumentoModal = ok['respuesta']['TipoDocumento'];
          this.personaModal.numeroDocumentoModal = ok['respuesta']['NumeroDocumento'];
          try {
            this.personaModal.idTipoTelefonoModal1 = ok['respuesta']['ListaTelefono'][0]['TipoTelefono']['IdTipoTelefono'];
            this.personaModal.telefonoModal1 = ok['respuesta']['ListaTelefono'][0]['Numero'];
            this.personaModal.idTipoTelefonoModal2 = ok['respuesta']['ListaTelefono'][1]['TipoTelefono']['IdTipoTelefono'];
            this.personaModal.telefonoModal2 = ok['respuesta']['ListaTelefono'][1]['Numero'];
            this.personaModal.correoModal = ok['respuesta']['ListaCorreo'][0]['CorreoValor'];

            this.personaModal.idComunidadModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['IdComunidad'];
            this.personaModal.comunidadModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Descripcion'];
            this.personaModal.idParroquiaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['IdParroquia'];
            this.personaModal.parroquiaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Descripcion'];
            this.personaModal.idCantonModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['IdCanton'];
            this.personaModal.cantonModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['Descripcion'];
            this.personaModal.idProvinciaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['Provincia']['IdProvincia'];
            this.personaModal.provinciaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['Provincia']['Descripcion'];
          } catch (error) {
            this.personaModal.telefonoModal1 = null;
            this.personaModal.telefonoModal2 = null;
            this.personaModal.correoModal = null;
            this.personaModal.comunidadModal = null;
            this.personaModal.parroquiaModal = null;
            this.personaModal.cantonModal = null;
            this.personaModal.provinciaModal = null;
          }
          if (value == 'detalles') {
            this.abrirModal(this.personaModal)
          }
          else if (value == 'modificar') {
            this.modificarPersona(this.personaModal);
          }
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
        telefonoModal1: this.personaModal.telefonoModal1,
        telefonoModal2: this.personaModal.telefonoModal2,
        correoModal: this.personaModal.correoModal,
        comunidadModal: this.personaModal.comunidadModal,
        parroquiaModal: this.personaModal.parroquiaModal,
        cantonModal: this.personaModal.cantonModal,
        provinciaModal: this.personaModal.provinciaModal
      }
    });
  }

  modificarPersona(
    persona: PersonaModal
  ) {
    this.nombres = persona.primerNombreModal + ' ' +
      persona.segundoNombreModal;
    this.apellidos = persona.apellidoPaternoModal + ' ' +
      persona.apellidoMaternoModal;
    this.tipoDocumento = persona.idTipoDocumentoModal;
    this.numeroDocumento = persona.numeroDocumentoModal;
    this.telefono1 = persona.telefonoModal1;
    this.tipoTelefono1 = persona.idTipoTelefonoModal1;
    this.telefono2 = persona.telefonoModal2;
    this.tipoTelefono2 = persona.idTipoTelefonoModal2;
    this.correo = persona.correoModal;
    this.provincia = persona.idProvinciaModal;
    this.consultarCantonesDeUnaProvincia(persona.idProvinciaModal, '');
    this.canton = persona.idCantonModal;
    this.consultarParroquiasDeUnCanton(persona.idCantonModal, '');
    this.parroquia = persona.idParroquiaModal;
    this.consultarComunidadesDeUnaParroquia(persona.idParroquiaModal, '');
    this.comunidad = persona.idComunidadModal;
  }

  limpiarCampos() {
    this.nombres = '';
    this.apellidos = '';
    this.tipoDocumento = '0';
    this.numeroDocumento = '';
    this.telefono1 = '';
    this.tipoTelefono1 = '0';
    this.telefono2 = '';
    this.tipoTelefono2 = '0';
    this.correo = '';
  }

  get _nombres() {
    return this.myForm.get('_nombres');
  }
  get _apellidos() {
    return this.myForm.get('_apellidos');
  }
  get _tipoDocumento() {
    return this.myForm.get('_tipoDocumento');
  }
  get _numeroDocumento() {
    return this.myForm.get('_numeroDocumento');
  }
  get _telefono1() {
    return this.myForm.get('_telefono1');
  }
  get _tipoTelefono1() {
    return this.myForm.get('_tipoTelefono1');
  }
  get _telefono2() {
    return this.myForm.get('_telefono2')
  }
  get _tipoTelefono2() {
    return this.myForm.get('_tipoTelefono2')
  }
  get _correo() {
    return this.myForm.get('_correo');
  }
  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
  }

}
