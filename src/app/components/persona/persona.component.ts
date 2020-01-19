import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, Form } from '@angular/forms';
import sweetalert from "sweetalert"

// Services
import { PersonaService } from "../../services/persona.service";

// Interfaces
import { Persona } from "../../interfaces/persona/persona";
import { TipoDocumento } from "../../interfaces/tipo-documento/tipo-documento";
import { Provincia } from 'src/app/interfaces/provincia/provincia';
import { Canton } from 'src/app/interfaces/canton/canton';
import { Parroquia } from 'src/app/interfaces/parroquia/parroquia';
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
    });
  }

  tituloAlerta: string = '';
  tipoDocumento = "0";
  tipoTelefono1 = "0";
  tipoTelefono2 = "0";
  provincia = "0";
  canton = "0";
  parroquia = "0";

  inputNombres = true;
  inputApellidos = true;
  inputCedula = true;
  selectTipoDocumento = true;
  selectTipoTelefono1 = true;
  selectTipoTelefono2 = true;
  selectProvincia = true;
  selectCanton = true;
  selectParroquia = true;

  correo: string;
  nuevaPersona = 'Nueva Persona';
  contacto = 'Contacto ';
  direccion = 'Direccion';

  idPersona: string;
  botonInsertar = "insertar";

  cantones: Canton[] = [];
  parroquias: Parroquia[] = [];
  personaModal: PersonaModal = {};
  personas: Persona[] = [];
  provincias: Provincia[] = [];
  telefonos: Telefono[] = [];
  tipoDocumentos: TipoDocumento[] = [];
  tipoTelefonos: TipoTelefono[] = [];
  filterPersona = '';

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
          if (value == 'ingresar') {
            this.canton = '0',
              this.parroquia = '0',
              this.parroquias = null;
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
          if (value == 'ingresar') {
            this.parroquia = '0';
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
  }

  validarNombres(validarDosNombres) {
    var arrayNombres = this.myForm.get('_nombres').value.split(' ');
    if (arrayNombres.length == 1) {
      this.inputNombres = false;
    } else if (arrayNombres.length >= 2) {
      if (arrayNombres[0].length > 0 && arrayNombres[1].length > 0) {
        validarDosNombres.primerCampo = arrayNombres[0];
        validarDosNombres.segundoCampo = arrayNombres[1];
        validarDosNombres.valido = true;
        return validarDosNombres;
      } else {
        this.inputNombres = false;
      }
    }
  }

  validarApellidos(validarDosApellidos) {
    var arrayApellidos = this.myForm.get('_apellidos').value.split(' ');
    if (arrayApellidos.length == 1) {
      this.inputApellidos = false;
    } else if (arrayApellidos.length >= 2) {
      if (arrayApellidos[0].length > 0 && arrayApellidos[1].length > 0) {
        validarDosApellidos.primerCampo = arrayApellidos[0];
        validarDosApellidos.segundoCampo = arrayApellidos[1];
        validarDosApellidos.valido = true;
        return validarDosApellidos;
      } else {
        this.inputApellidos = false;
      }
    }
  }

  validarFormulario() {
    this.validarSelects(
      this.tipoDocumento, this.tipoTelefono1,
      this.tipoTelefono2, this.provincia,
      this.canton, this.parroquia,
    )
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == 'insertar') {
        if (
          this.selectTipoDocumento && this.selectTipoTelefono1 &&
          this.selectTipoTelefono2 && this.selectProvincia &&
          this.selectCanton && this.selectParroquia
        ) {
          this.crearPersona();
        }
      } else if (this.testButton.nativeElement.value == 'modificar') {
        if (
          this.selectTipoDocumento && this.selectTipoTelefono1 &&
          this.selectTipoTelefono2 && this.selectProvincia &&
          this.selectCanton && this.selectParroquia
        ) {
          this.actualizarPersona('modificar', this.personaModal);
          this.testButton.nativeElement.value = 'insertar';
        }
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

  onChangeSelectParroquia(value) {
    if (value != "0") {
      this.selectParroquia = true;
    }
  }

  onChangeInputNombres() {
    this.inputNombres = true;
  }

  onChangeInputApellidos() {
    this.inputApellidos = true;
  }

  onChangeInputCedula() {
    this.inputCedula = true;
  }

  crearPersona() {
    var validarNombress = {
      primerCampo: '',
      segundoCampo: '',
      valido: Boolean
    }
    var validarApellidos = {
      primerCampo: '',
      segundoCampo: '',
      valido: Boolean
    }
    var dosNombres = this.validarNombres(validarNombress);
    var dosApellidos = this.validarApellidos(validarApellidos);
    if (dosNombres.valido == true && dosApellidos.valido == true) {
      this.personaService.crearPersona(
        this.myForm.get('_numeroDocumento').value,
        this.tipoDocumento,
        dosApellidos.primerCampo,
        dosApellidos.segundoCampo,
        dosNombres.primerCampo,
        dosNombres.segundoCampo,
        localStorage.getItem('miCuenta.postToken'))
        .then(
          ok => {
            if (ok['respuesta'] == 'false') {
              this.inputCedula = false;
            } else {
              this.idPersona = ok['respuesta'];
              this.crearTelefono(this.idPersona);
              this.crearCorreo(this.idPersona);
              this.crearDireccion(this.idPersona);
            }
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
    console.log(idPersona);
    this.personaService.crearDireccion(
      idPersona,
      this.parroquia,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.myForm.reset();
          this.limpiarSelects();
          this.consultarPersonas();
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

  eliminarPersona(idPersona: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.personaService.eliminarPersona(
            idPersona,
            localStorage.getItem('miCuenta.deleteToken'))
            .then(
              ok => {
                console.log(ok['respuesta']);
                this.consultarPersonas();
              },
            )
            .catch(
              err => {
                console.log(err);
              }
            )
          sweetalert("Se a eliminado Correctamente!", {
            icon: "success",
          });
        }
      });
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
          console.log(ok['respuesta']);
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
            if (ok['respuesta']['ListaCorreo'] == null) {
              this.personaModal.correoModal = '';
              this.personaModal.idCorreoModal = ''
            } else {
              this.personaModal.correoModal = ok['respuesta']['ListaCorreo'][0]['CorreoValor'];
              this.personaModal.idCorreoModal = ok['respuesta']['ListaCorreo'][0]['IdCorreo'];
            }
            this.personaModal.idParroquiaModal = ok['respuesta']['AsignacionPersonaParroquia'][0]['Parroquia']['IdParroquia'];
            this.personaModal.parroquiaModal = ok['respuesta']['AsignacionPersonaParroquia'][0]['Parroquia']['Descripcion'];
            this.personaModal.idCantonModal = ok['respuesta']['AsignacionPersonaParroquia'][0]['Parroquia']['Canton']['IdCanton'];
            this.personaModal.cantonModal = ok['respuesta']['AsignacionPersonaParroquia'][0]['Parroquia']['Canton']['Descripcion'];
            this.personaModal.idProvinciaModal = ok['respuesta']['AsignacionPersonaParroquia'][0]['Parroquia']['Canton']['Provincia']['IdProvincia'];
            this.personaModal.provinciaModal = ok['respuesta']['AsignacionPersonaParroquia'][0]['Parroquia']['Canton']['Provincia']['Descripcion'];
            this.personaModal.idAsignacionPC = ok['respuesta']['AsignacionPersonaParroquia'][0]['IdAsignacionPC'];

          } catch (error) {
            console.log(error);
          }
          if (value == 'detalles') {
            this.abrirModal(this.personaModal)
          } else if (value == 'modificar') {
            this.nuevaPersona = 'Modificar Persona';
            this.contacto = 'Modificar Contacto';
            this.direccion = 'Modificar Direccion';
            this.actualizarPersona('', this.personaModal);
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
      height: '450px',
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
        parroquiaModal: this.personaModal.parroquiaModal,
        cantonModal: this.personaModal.cantonModal,
        provinciaModal: this.personaModal.provinciaModal
      }
    });
  }

  actualizarPersona(
    value: string,
    personaModal?: PersonaModal
  ) {
    if (value == '') {
      var nombres = personaModal.primerNombreModal + ' ' + personaModal.segundoNombreModal;
      var apellidos = personaModal.apellidoPaternoModal + ' ' + personaModal.apellidoMaternoModal;
      this.myForm.patchValue({
        _nombres: nombres,
        _apellidos: apellidos,
        _numeroDocumento: personaModal.numeroDocumentoModal,
        _telefono1: personaModal.telefonoModal1,
        _telefono2: personaModal.telefonoModal2,
      });
      if (this.personaModal.correoModal == null) {
        this.correo = 'Sin Correo';
      } else {
        this.correo = personaModal.correoModal;
      }
      this.tipoDocumento = personaModal.idTipoDocumentoModal;
      this.tipoTelefono1 = personaModal.idTipoTelefonoModal1;
      this.tipoTelefono2 = personaModal.idTipoTelefonoModal2;
      this.provincia = personaModal.idProvinciaModal;
      this.consultarCantonesDeUnaProvincia(personaModal.idProvinciaModal, '');
      this.canton = personaModal.idCantonModal;
      this.consultarParroquiasDeUnCanton(personaModal.idCantonModal, '');
      this.parroquia = personaModal.idParroquiaModal;
    }
    if (value == "modificar") {
      var validarNombress = {
        primerCampo: '',
        segundoCampo: '',
        valido: Boolean
      }
      var validarApellidos = {
        primerCampo: '',
        segundoCampo: '',
        valido: Boolean
      }
      var dosNombres = this.validarNombres(validarNombress);
      var dosApellidos = this.validarApellidos(validarApellidos);
      if (dosNombres.valido == true && dosApellidos.valido == true) {
        this.personaService.actualizarPersona(
          personaModal.idPersona,
          this.myForm.get('_numeroDocumento').value,
          this.tipoDocumento,
          dosApellidos.primerCampo,
          dosApellidos.segundoCampo,
          dosNombres.primerCampo,
          dosNombres.segundoCampo,
          localStorage.getItem('miCuenta.putToken'))
          .then(
            ok => {
              if (ok['respuesta'] == 'false') {
                this.inputCedula = false;
              } else {
                var idPersona = personaModal.idPersona;
                var idTelefono1 = personaModal.idTelefonoModal1;
                var idTelefono2 = personaModal.idTelefonoModal2;
                this.actualizarTelefono(idPersona, idTelefono1, idTelefono2);
                var idCorreo = personaModal.idCorreoModal;
                this.actualizarCorreo(idPersona, idCorreo);
                var idAsignacionPC = personaModal.idAsignacionPC;
                this.actualizarDireccion(idPersona, idAsignacionPC);
                this.nuevaPersona = 'Nueva Persona';
                this.contacto = 'Contacto ';
                this.direccion = 'Direccion';
              }
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

  limpiarSelects() {
    this.tipoDocumento = '0',
      this.tipoTelefono1 = '0';
    this.tipoTelefono2 = '0';
    this.provincia = '0';
    this.canton = '0';
    this.parroquia = '0';
    this.correo = '';
    this.cantones = null;
    this.parroquias = null;
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
      this.correo,
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
      this.parroquia,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.myForm.reset();
          this.limpiarSelects();
          this.consultarPersonas();
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

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
  }

  tablaPersonas = ['nombres', 'apellidos', 'documento', 'numeroDocumento', 'acciones'];

}
