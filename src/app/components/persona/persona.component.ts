import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

// Components
import { ModalDetallePersonaComponent } from "src/app/components/modal-detalle-persona/modal-detalle-persona.component";

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { PersonaService } from "../../services/persona.service";

// SweetAlert
import sweetalert from "sweetalert"

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
  ) {
    this.myForm = new FormGroup({
      _nombres: new FormControl('', [Validators.required]),
      _apellidos: new FormControl('', [Validators.required]),
      _numeroDocumento: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      _telefono1: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      _telefono2: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      _correo: new FormControl('', [Validators.email]),
      _tipoDocumento: new FormControl('', [Validators.required]),
      _tipoTelefono1: new FormControl('', [Validators.required]),
      _tipoTelefono2: new FormControl('', [Validators.required]),
      _provincia: new FormControl('', [Validators.required]),
      _canton: new FormControl('', [Validators.required]),
      _parroquia: new FormControl('', [Validators.required]),
      _idCorreo: new FormControl(''),
      _idAsignacionPersonaParroquia: new FormControl(''),
      _idPersona: new FormControl(''),
      _idTelefono1: new FormControl(''),
      _idTelefono2: new FormControl('')
    });
  }

  botonInsertar = "insertar";
  contacto = 'Contacto ';
  direccion = 'Direccion';
  filterPersona = '';
  guardar = 'Guardar';
  nuevaPersona = 'Nueva Persona';

  cantones: any[] = [];
  parroquias: any[] = [];
  personaModal: any = {};
  personas: any[] = [];
  provincias: any[] = [];
  telefonos: any[] = [];
  tipoDocumentos: any[] = [];
  tipoTelefonos: any[] = [];

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
          console.log(ok['respuesta']);
          
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
    value?: string
  ) {
    this.personaService.consultarCantonesDeUnaProvincia(
      idProvincia,
      localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
          if (value == 'ingresar') {
            this._canton.setValue('0');
            this._parroquia.setValue('0');
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
    value?: string,
  ) {
    this.personaService.consultarParroquiasDeUnCanton(
      idCanton, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
          if (value == 'ingresar') {
            this._parroquia.setValue('0');
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  validarNombres(validarDosNombres) {
    var arrayNombres = this.myForm.get('_nombres').value.split(' ');
    if (arrayNombres.length == 1) {
      sweetAlert("Necesita dos Nombres!", {
        icon: "warning",
      });
    } else if (arrayNombres.length >= 2) {
      if (arrayNombres[0].length > 0 && arrayNombres[1].length > 0) {
        validarDosNombres.primerCampo = arrayNombres[0];
        validarDosNombres.segundoCampo = arrayNombres[1];
        validarDosNombres.valido = true;
        return validarDosNombres;
      } else {
        sweetAlert("Necesita dos Nombres!", {
          icon: "warning",
        });
      }
    }
  }

  validarApellidos(validarDosApellidos) {
    var arrayApellidos = this.myForm.get('_apellidos').value.split(' ');
    if (arrayApellidos.length == 1) {
      sweetAlert("Necesita dos apellidos!", {
        icon: "warning",
      });
    } else if (arrayApellidos.length >= 2) {
      if (arrayApellidos[0].length > 0 && arrayApellidos[1].length > 0) {
        validarDosApellidos.primerCampo = arrayApellidos[0];
        validarDosApellidos.segundoCampo = arrayApellidos[1];
        validarDosApellidos.valido = true;
        return validarDosApellidos;
      } else {
        sweetAlert("Necesita dos apellidos!", {
          icon: "warning",
        });
      }
    }
  }

  validarFormulario() {
    console.log(this.botonInsertar);
    
    if (this.myForm.valid) {
      if (this.botonInsertar == 'insertar') {
        this.crearPersona();
      } else if (this.botonInsertar == 'modificar') {
        this.actualizarPersona();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearPersona() {
    console.log(this.myForm.value);
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
        this._numeroDocumento.value,
        this._tipoDocumento.value,
        dosApellidos.primerCampo,
        dosApellidos.segundoCampo,
        dosNombres.primerCampo,
        dosNombres.segundoCampo,
        localStorage.getItem('miCuenta.postToken'))
        .then(
          ok => {
            if (ok['respuesta'] == 'false') {
              sweetAlert("Cédula ya existe!", {
                icon: "warning",
              });
            } else if (ok['respuesta'] == '400') {
              this.myForm.reset();
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            } else {
              this._idPersona.setValue(ok['respuesta']);
              this.crearTelefono(this._idPersona.value);
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
        Numero: this._telefono1.value,
        IdTipoTelefono: this._tipoTelefono1.value,
      },
      {
        IdPersona: idPersona,
        Numero: this._telefono2.value,
        IdTipoTelefono: this._tipoTelefono2.value,
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
              if (ok['respuesta']) {
                this.crearCorreo(this._idPersona.value);
              } else {
                sweetAlert("Ha ocurrido un error!", {
                  icon: "error",
                });
                this._telefono1.setValue('');
                this._telefono2.setValue('');
                this._tipoTelefono1.setValue('');
                this._tipoTelefono2.setValue('');
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
      this._correo.value,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          if (ok['respuesta']) {
            this.crearDireccion(this._idPersona.value);
          } else {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
            this._correo.setValue('');
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
    this.personaService.crearDireccion(
      idPersona,
      this._parroquia.value,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          if (ok['respuesta']) {
            this.myForm.reset();
            this.consultarPersonas();
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
          } else {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
            this._provincia.setValue('0');
            this._canton.setValue('0');
            this._parroquia.setValue('0');
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
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

  abrirModal(persona) {
    let dialogRef = this.dialog.open(ModalDetallePersonaComponent, {
      width: '500px',
      height: 'auto',
      data: {
        persona: persona
      }
    });
  }

  mostrarPersona(persona) {
    this.nuevaPersona = 'Modificar Persona';
    this.contacto = 'Modificar Contacto';
    this.direccion = 'Modificar Direccion';
    this.guardar = 'Modificar';
    this._idPersona.setValue(persona.IdPersona);
    var nombres = persona.PrimerNombre + ' ' + persona.SegundoNombre;
    var apellidos = persona.ApellidoPaterno + ' ' + persona.ApellidoMaterno;
    if (persona.ListaCorreo == null) {
      this._correo.setValue('');
    } else {
      this._idCorreo.setValue(persona.ListaCorreo[0].IdCorreo);
      this._correo.setValue(persona.ListaCorreo[0].CorreoValor);
    }
    this._nombres.setValue(nombres);
    this._apellidos.setValue(apellidos);
    this._tipoDocumento.setValue(persona.IdTipoDocumento);
    this._numeroDocumento.setValue(persona.NumeroDocumento);
    this._idTelefono1.setValue(persona.ListaTelefono[0].IdTelefono);
    this._telefono1.setValue(persona.ListaTelefono[0].Numero);
    this._tipoTelefono1.setValue(persona.ListaTelefono[0].TipoTelefono.IdTipoTelefono);
    this._idTelefono2.setValue(persona.ListaTelefono[1].IdTelefono);
    this._telefono2.setValue(persona.ListaTelefono[1].Numero);
    this._tipoTelefono2.setValue(persona.ListaTelefono[1].TipoTelefono.IdTipoTelefono);
    this._provincia.setValue(persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Provincia.IdProvincia);
    this.consultarCantonesDeUnaProvincia(this._provincia.value, '');
    this._canton.setValue(persona.AsignacionPersonaParroquia[0].Parroquia.Canton.IdCanton);
    this.consultarParroquiasDeUnCanton(this._canton.value, '');
    this._parroquia.setValue(persona.AsignacionPersonaParroquia[0].Parroquia.IdParroquia);
    this._idAsignacionPersonaParroquia.setValue(persona.AsignacionPersonaParroquia[0].IdAsignacionPC);
    this.botonInsertar = 'modificar';
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
        this._idPersona.value,
        this._numeroDocumento.value,
        this._tipoDocumento.value,
        dosApellidos.primerCampo,
        dosApellidos.segundoCampo,
        dosNombres.primerCampo,
        dosNombres.segundoCampo,
        localStorage.getItem('miCuenta.putToken'))
        .then(
          ok => {
            if (ok['respuesta'] == 'false') {
              sweetAlert("Cédula ya existe!", {
                icon: "warning",
              });
            } else if (ok['respuesta'] == '400') {
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            } else {
              this.actualizarTelefono();
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

  actualizarTelefono() {
    this.telefonos.push(
      {
        IdPersona: this._idPersona.value,
        IdTelefono: this._idTelefono1.value,
        Numero: this._telefono1.value,
        IdTipoTelefono: this._tipoTelefono1.value
      },
      {
        IdPersona: this._idPersona.value,
        IdTelefono: this._idTelefono2.value,
        Numero: this._telefono2.value,
        IdTipoTelefono: this._tipoTelefono2.value
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
              if (ok['respuesta']) {
                this.actualizarCorreo(this._idPersona.value, this._idCorreo.value);
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
          if (ok['respuesta']) {
            this.actualizarDireccion(
              this._idPersona.value,
              this._idAsignacionPersonaParroquia.value
            );
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

  actualizarDireccion(
    idPersona: string,
    idAsignacionPC: string
  ) {
    this.personaService.actualizarDireccion(
      idPersona,
      idAsignacionPC,
      this.myForm.get('_parroquia').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          if (ok['respuesta']) {
            this.myForm.reset();
            this.botonInsertar = 'insertar';
            this.consultarPersonas();
            this.nuevaPersona = 'Nueva Persona';
            this.contacto = 'Contacto ';
            this.direccion = 'Direccion';
            this.guardar = 'Guardar';
            sweetAlert("Se actualizó correctamente!", {
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

  get _provincia() {
    return this.myForm.get('_provincia');
  }

  get _canton() {
    return this.myForm.get('_canton');
  }

  get _parroquia() {
    return this.myForm.get('_parroquia');
  }

  get _idCorreo() {
    return this.myForm.get('_idCorreo');
  }

  get _idAsignacionPersonaParroquia() {
    return this.myForm.get('_idAsignacionPersonaParroquia');
  }

  get _idPersona() {
    return this.myForm.get('_idPersona');
  }

  get _idTelefono1() {
    return this.myForm.get('_idTelefono1');
  }

  get _idTelefono2() {
    return this.myForm.get('_idTelefono2');
  }

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
  }

  tablaPersonas = ['nombres', 'apellidos', 'documento', 'numeroDocumento', 'acciones'];
  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}