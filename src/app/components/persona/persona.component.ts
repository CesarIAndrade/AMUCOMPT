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

  tipoDocumento = "0";
  tipoTelefono1 = "0";
  tipoTelefono2 = "0";
  provincia = "0";
  canton = "0";
  parroquia = "0";
  asignacionPersonaParroquia = "0";

  inputNombres = true;
  inputApellidos = true;
  inputCedula = true;
  selectTipoDocumento = true;
  selectTipoTelefono1 = true;
  selectTipoTelefono2 = true;
  selectProvincia = true;
  selectCanton = true;
  selectParroquia = true;
  idCorreo = '0';
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
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarCantones() {
    this.personaService.consultarCantones(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarParroquias() {
    this.personaService.consultarParroquias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarPersonas() {
    this.personaService.consultarPersonas(localStorage.getItem('miCuenta.getToken'))
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

  consultarTipoDocumento() {
    this.personaService.consultarTipoDocumento(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoDocumentos = ok['respuesta'];
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarTipoTelefono() {
    this.personaService.consultarTipoTelefono(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoTelefonos = ok['respuesta'];
        },
      )
      .catch(
        error => {
          console.log(error);
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
        error => {
          console.log(error);
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
        error => {
          console.log(error);
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
          this.actualizarPersona();
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
            }
          },
        )
        .catch(
          error => {
            console.log(error);
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
              if(ok['respuesta']) {
                this.crearCorreo(this.idPersona);
              }
            },
          )
          .catch(
            error => {
              console.log(error);
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
          if(ok['respuesta']) {
            this.crearDireccion(this.idPersona);
          }
        },
      )
      .catch(
        error => {
          console.log(error);
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
          if(ok['respuesta']) {
            this.myForm.reset();
            this.limpiarSelects();
            this.consultarPersonas();
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
          } else {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  cantonesDeUnaProvincia(value) {
    this.consultarCantonesDeUnaProvincia(value, 'ingresar');
  }

  parroquiasDeUnCanton(value) {
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
                sweetalert("Se ha eliminado correctamente!", {
                  icon: "success",
                });
                this.consultarPersonas();
              },
            )
            .catch(
              error => {
                console.log(error);
              }
            )
        }
      });
  }

  consultarPersonaPorId(
    value: string,
    idPersona: string
  ) {
    console.log(idPersona);
    
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
            // this.actualizarPersona();
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  abrirModal(persona) {
    let dialogRef = this.dialog.open(ModalDetallePersonaComponent, {
      width: '500px',
      height: '450px',
      data: {
        persona: persona
      }
    });
  }

  mostrarPersona(persona) {
    this.nuevaPersona = 'Modificar Persona';
    this.contacto = 'Modificar Contacto';
    this.direccion = 'Modificar Direccion';
    this.idPersona = persona.IdPersona;
    var nombres = persona.PrimerNombre + ' ' + persona.SegundoNombre;
    var apellidos = persona.ApellidoPaterno + ' ' + persona.ApellidoMaterno;
    this.myForm.setValue({
      _nombres: nombres,
      _apellidos: apellidos,
      _numeroDocumento: persona.NumeroDocumento,
      _telefono1: persona.ListaTelefono[0].Numero,
      _telefono2: persona.ListaTelefono[1].Numero,
    });
    if (persona.ListaCorreo == null) {
      this.correo = 'Sin Correo';
    } else {
      this.idCorreo = persona.ListaCorreo[0].IdCorreo;
      this.correo = persona.ListaCorreo[0].CorreoValor;
    }
    this.tipoDocumento = persona.IdTipoDocumento;
    this.tipoTelefono1 = persona.ListaTelefono[0].TipoTelefono.IdTipoTelefono;
    this.tipoTelefono2 = persona.ListaTelefono[1].TipoTelefono.IdTipoTelefono;
    this.asignacionPersonaParroquia = persona.AsignacionPersonaParroquia[0].IdAsignacionPC;
    this.provincia = persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Provincia.IdProvincia;
    this.consultarCantonesDeUnaProvincia(this.provincia, '');
    this.canton = persona.AsignacionPersonaParroquia[0].Parroquia.Canton.IdCanton;
    this.consultarParroquiasDeUnCanton(this.canton, '');
    this.parroquia = persona.AsignacionPersonaParroquia[0].Parroquia.IdParroquia;
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarPersona() {
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
        this.idPersona,
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
              this.actualizarTelefono(this.idPersona, this.tipoTelefono1, this.tipoTelefono2);
              this.actualizarCorreo(this.idPersona, this.idCorreo);
              this.actualizarDireccion(this.idPersona, this.asignacionPersonaParroquia);
              this.nuevaPersona = 'Nueva Persona';
              this.contacto = 'Contacto ';
              this.direccion = 'Direccion';
            }
          },
        )
        .catch(
          error => {
            console.log(error);
          }
        )
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
            error => {
              console.log(error);
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
        error => {
          console.log(error);
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
          this.testButton.nativeElement.value = 'insertar';
          this.consultarPersonas();
        },
      )
      .catch(
        error => {
          console.log(error);
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