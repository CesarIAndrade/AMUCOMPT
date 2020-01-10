import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, Form } from '@angular/forms';

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
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(
    private personaService: PersonaService,
    private dialog: MatDialog,
  ) {
    this.myForm = new FormGroup({
      _nombres: new FormControl('', [Validators.required]),
      _apellidos: new FormControl('', [Validators.required]),
      _numeroDocumento: new FormControl('', [Validators.required]),
      _telefono1: new FormControl('', [Validators.required]),
      _telefono2: new FormControl('', [Validators.required]),
      _correo: new FormControl('', [Validators.required])
    }, { updateOn: 'blur' });
  }

  tipoDocumento = "0";
  tipoTelefono1 = "0";
  tipoTelefono2 = "0";
  provincia = "0";
  canton = "0";
  parroquia = "0";
  comunidad = "0";

  inputNombres = true;
  inputApellidos = true;
  selectTipoDocumento = true;
  selectTipoTelefono1 = true;
  selectTipoTelefono2 = true;
  selectProvincia = true;
  selectCanton = true;
  selectParroquia = true;
  selectComunidad = true;

  idPersona: string;
  botonInsertar = "insertar";

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

  consultarCantonesDeUnaProvincia(
    idProvincia: string,
    value: string
  ) {
    if (this.provincia != "0") {
      this.selectProvincia = true;
    }
    this.personaService.consultarCantonesDeUnaProvincia(
      idProvincia,
      localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
          console.log(this.cantones);
          if (value == 'ingresar') {
            this.canton = '0',
              this.parroquia = '0',
              this.comunidad = '0'
            this.parroquias = null;
            this.comunidades = null;
          }
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarParroquiasDeUnCanton(
    idCanton: string,
    value: string,
  ) {
    if (this.canton != "0") {
      this.selectCanton = true;
    }
    this.personaService.consultarParroquiasDeUnCanton(
      idCanton, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
          console.log(this.parroquias);
          if (value == 'ingresar') {
            this.parroquia = '0',
              this.comunidad = '0'
            this.comunidades = null;
          }
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarComunidadesDeUnaParroquia(
    idComunidad: string,
    value: string
  ) {
    if (this.comunidad != "0") {
      this.selectParroquia = true;
    }
    this.personaService.consultarComunidadesDeUnaParroquia(
      idComunidad, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.comunidades = ok['respuesta'];
          console.log(this.comunidades);
          if (value == 'ingresar') {
            this.comunidad = "0";
          }
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  validarSelects(
    tipoDocumento: string,
    tipoTelefono1: string,
    tipoTelefono2: string,
    provincia: string,
    canton: string,
    parroquia: string,
    comunidad: string
  ) {
    if (tipoDocumento == "0") {
      this.selectTipoDocumento = false;
    }
    if (tipoTelefono1 == "0") {
      this.selectTipoTelefono1 = false;
    }
    if (tipoTelefono2 == "0") {
      this.selectTipoTelefono2 = false;
    }
    if (provincia == "0") {
      this.selectProvincia = false;
    }
    if (canton == "0") {
      this.selectCanton = false;
    }
    if (parroquia == "0") {
      this.selectParroquia = false;
    }
    if (comunidad == "0") {
      this.selectComunidad = false;
    }
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == 'insertar') {
        console.log(this.testButton.nativeElement.value);
        this.crearPersona();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        console.log(this.testButton.nativeElement.value);
        this.modificarPersona('modificar', this.personaModal);
        // this.testButton.nativeElement.value = 'insertar';
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  onChangeSelectTipoDocumento(value) {
    if (value != "0") {
      this.selectTipoDocumento = true;
    }
  }

  onChangeSelectTipoTelefono1(value) {
    if (value != "0") {
      this.selectTipoTelefono1 = true;
    }
  }

  onChangeSelectTipoTelefono2(value) {
    if (value != "0") {
      this.selectTipoTelefono2 = true;
    }
  }

  onChangeSelectComunidad(value) {
    if (value != "0") {
      this.selectComunidad = true;
    }
  }

  onChangeInputNombres() {
    this.inputNombres = true;
  }

  onChangeInputApellidos() {
    this.inputApellidos = true;
  }

  crearPersona() {
    var dosNombres = false;
    var dosApellidos = false;

    this.validarSelects(
      this.tipoDocumento,
      this.tipoTelefono1,
      this.tipoTelefono2,
      this.provincia,
      this.canton,
      this.parroquia,
      this.comunidad
    )

    var arrayNombres = this.myForm.get('_nombres').value.split(' ');
    var primerNombre: string;
    var segundoNombre: string;
    if (arrayNombres.length == 1) {
      this.inputNombres = false;
    } else if (arrayNombres.length >= 2) {
      if (arrayNombres[0].length > 0 && arrayNombres[1].length > 0) {
        primerNombre = arrayNombres[0];
        segundoNombre = arrayNombres[1];
        dosNombres = true;
      } else {
        this.inputNombres = false;
      }
    }

    var arrayApellidos = this.myForm.get('_apellidos').value.split(' ');
    var apellidoPaterno: string;
    var apellidoMaterno: string;
    if (arrayApellidos.length == 1) {
      this.inputApellidos = false;
    } else if (arrayApellidos.length >= 2) {
      if (arrayApellidos[0].length > 0 && arrayApellidos[1].length > 0) {
        apellidoPaterno = arrayApellidos[0];
        apellidoMaterno = arrayApellidos[1];
        dosApellidos = true;
      } else {
        this.inputApellidos = false;
      }
    }

    if (dosNombres == true && dosApellidos == true) {
      this.personaService.crearPersona(
        this.myForm,
        this.tipoDocumento,
        apellidoPaterno,
        apellidoMaterno,
        primerNombre,
        segundoNombre,
        localStorage.getItem('miCuenta.postToken'))
        .then(
          ok => {
            console.log(ok['respuesta']);
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
  }

  crearTelefono(idPersona: string) {
    this.telefonos.push(
      {
        IdPersona: idPersona,
        Numero: this.myForm.get('_telefono1').value,
        IdTipoTelefono: this.tipoTelefono1
      },
      {
        IdPersona: idPersona,
        Numero: this.myForm.get('_telefono2').value,
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
      this.myForm,
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
    idPersona: string
  ) {
    this.testButton.nativeElement.value = value;
    this.personaService.consultarPersonaPorId(
      idPersona,
      localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          // console.log(ok['respuesta']);
          this.personaModal.idPersona = ok['respuesta']['IdPersona'];
          this.personaModal.primerNombreModal = ok['respuesta']['PrimerNombre'];
          this.personaModal.segundoNombreModal = ok['respuesta']['SegundoNombre'];
          this.personaModal.apellidoPaternoModal = ok['respuesta']['ApellidoPaterno'];
          this.personaModal.apellidoMaternoModal = ok['respuesta']['ApellidoMaterno'];
          this.personaModal.idTipoDocumentoModal = ok['respuesta']['IdTipoDocumento'];
          this.personaModal.tipoDocumentoModal = ok['respuesta']['TipoDocumento'];
          this.personaModal.numeroDocumentoModal = ok['respuesta']['NumeroDocumento'];
          try {
            this.personaModal.idTipoTelefonoModal1 = ok['respuesta']['ListaTelefono'][0]['TipoTelefono']['IdTipoTelefono'];
            this.personaModal.idTelefonoModal1 = ok['respuesta']['ListaTelefono'][0]['IdTelefono'];
            this.personaModal.telefonoModal1 = ok['respuesta']['ListaTelefono'][0]['Numero'];
            this.personaModal.idTipoTelefonoModal2 = ok['respuesta']['ListaTelefono'][1]['TipoTelefono']['IdTipoTelefono'];
            this.personaModal.idTelefonoModal2 = ok['respuesta']['ListaTelefono'][1]['IdTelefono'];
            this.personaModal.telefonoModal2 = ok['respuesta']['ListaTelefono'][1]['Numero'];
            this.personaModal.correoModal = ok['respuesta']['ListaCorreo'][0]['CorreoValor'];
            this.personaModal.idCorreoModal = ok['respuesta']['ListaCorreo'][0]['IdCorreo'];
            this.personaModal.idComunidadModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['IdComunidad'];
            this.personaModal.comunidadModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Descripcion'];
            this.personaModal.idParroquiaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['IdParroquia'];
            this.personaModal.parroquiaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Descripcion'];
            this.personaModal.idCantonModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['IdCanton'];
            this.personaModal.cantonModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['Descripcion'];
            this.personaModal.idProvinciaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['Provincia']['IdProvincia'];
            this.personaModal.provinciaModal = ok['respuesta']['AsignacionPersonaComunidad'][0]['Comunidad']['Parroquia']['Canton']['Provincia']['Descripcion'];
            this.personaModal.idAsignacionPC = ok['respuesta']['AsignacionPersonaComunidad'][0]['IdAsignacionPC'];
            
          } catch (error) {
            console.log(error);
          }
          if (value == 'detalles') {
            this.abrirModal(this.personaModal)
          } else if (value == 'modificar') {
            this.modificarPersona('', this.personaModal);
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
    value: string,
    personaModal?: PersonaModal
  ) {

    if(value == ''){
      var nombres = personaModal.primerNombreModal + ' ' + personaModal.segundoNombreModal;
      var apellidos = personaModal.apellidoPaternoModal + ' ' + personaModal.apellidoMaternoModal;
      this.myForm.patchValue({
        _nombres: nombres,
        _apellidos: apellidos,
        _numeroDocumento: personaModal.numeroDocumentoModal,
        _telefono1: personaModal.telefonoModal1,
        _telefono2: personaModal.telefonoModal2,
        _correo: personaModal.correoModal,
      });
      this.tipoDocumento = personaModal.idTipoDocumentoModal;
      this.tipoTelefono1 = personaModal.idTipoTelefonoModal1;
      this.tipoTelefono2 = personaModal.idTipoTelefonoModal2;
      this.provincia = personaModal.idProvinciaModal;
      this.consultarCantonesDeUnaProvincia(personaModal.idProvinciaModal, '');
      this.canton = personaModal.idCantonModal;
      this.consultarParroquiasDeUnCanton(personaModal.idCantonModal, '');
      this.parroquia = personaModal.idParroquiaModal;
      this.consultarComunidadesDeUnaParroquia(personaModal.idParroquiaModal, '');
      this.comunidad = personaModal.idComunidadModal;
    } 


    if (value == "modificar") {

      var dosNombres = false;
      var dosApellidos = false;
      this.validarSelects(
        this.tipoDocumento,
        this.tipoTelefono1,
        this.tipoTelefono2,
        this.provincia,
        this.canton,
        this.parroquia,
        this.comunidad
      )

      var arrayNombres = this.myForm.get('_nombres').value.split(' ');
      var primerNombre: string;
      var segundoNombre: string;
      if (arrayNombres.length == 1) {
        this.inputNombres = false;
      } else if (arrayNombres.length >= 2) {
        if (arrayNombres[0].length > 0 && arrayNombres[1].length > 0) {
          primerNombre = arrayNombres[0];
          segundoNombre = arrayNombres[1];
          dosNombres = true;
        } else {
          this.inputNombres = false;
        }
      }

      var arrayApellidos = this.myForm.get('_apellidos').value.split(' ');
      var apellidoPaterno: string;
      var apellidoMaterno: string;
      if (arrayApellidos.length == 1) {
        this.inputApellidos = false;
      } else if (arrayApellidos.length >= 2) {
        if (arrayApellidos[0].length > 0 && arrayApellidos[1].length > 0) {
          apellidoPaterno = arrayApellidos[0];
          apellidoMaterno = arrayApellidos[1];
          dosApellidos = true;
        } else {
          this.inputApellidos = false;
        }
      }

      if (dosNombres == true && dosApellidos == true) {
        this.personaService.actualizarPersona(
          personaModal.idPersona,
          this.myForm.get('_numeroDocumento').value,
          this.tipoDocumento,
          apellidoPaterno,
          apellidoMaterno,
          primerNombre,
          segundoNombre,
          localStorage.getItem('miCuenta.putToken'))
          .then(
            ok => {
              console.log(ok['respuesta']);
              var idPersona = personaModal.idPersona;
              var idTelefono1 = personaModal.idTelefonoModal1;
              var idTelefono2 = personaModal.idTelefonoModal2;
              this.actualizarTelefono(idPersona, idTelefono1, idTelefono2);
              var idCorreo = personaModal.idCorreoModal;
              this.actualizarCorreo(idPersona, idCorreo);
              var idAsignacionPC = personaModal.idAsignacionPC;
              this.actualizarDireccion(idPersona, idAsignacionPC);
              this.consultarPersonas();
            },
          )
          .catch(
            err => {
              console.log(err);
            }
          )
      }
    }
  }

  actualizarTelefono(
    idPersona: string,
    idTelefono1: string,
    idTelefono2: string
  ) {
    this.telefonos.push(
      {
        IdPersona: idPersona,
        IdTelefono: idTelefono1,
        Numero: this.myForm.get('_telefono1').value,
        IdTipoTelefono: this.tipoTelefono1
      },
      {
        IdPersona: idPersona,
        IdTelefono: idTelefono2,
        Numero: this.myForm.get('_telefono2').value,
        IdTipoTelefono: this.tipoTelefono2
      }
    )

    this.telefonos.map(
      item => {
        this.personaService.actualizarTelefono(
          item.IdPersona,
          item.IdTelefono,
          item.Numero,
          item.IdTipoTelefono,
          localStorage.getItem('miCuenta.putToken'))
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

  actualizarCorreo(
    idPersona: string,
    idCorreo: string
  ) {
    this.personaService.actualizarCorreo(
      idPersona,
      idCorreo,
      this.myForm.get('_correo').value,
      localStorage.getItem('miCuenta.putToken'))
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

  actualizarDireccion(
    idPersona: string,
    idAsignacionPC: string
  ) {
    this.personaService.actualizarDireccion(
      idPersona,
      idAsignacionPC,
      this.comunidad,
      localStorage.getItem('miCuenta.putToken'))
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
