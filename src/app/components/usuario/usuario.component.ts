import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import sweetalert from "sweetalert"

// Services
import { UsuarioService } from 'src/app/services/usuario.service';
import { PersonaService } from 'src/app/services/persona.service';

// Interfaces
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { Persona } from 'src/app/interfaces/persona/persona';

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Components
import { ModalAsignacionUsuarioPersonaComponent } from '../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component';
import { ModalAsignacionUsuarioTiposUsuarioComponent } from '../modal-asignacion-usuario-tipos-usuario/modal-asignacion-usuario-tipos-usuario.component';

export interface DialogData {
  cedula: string;
  idPersona: string;
  idUsuario: string;
  nombres: string;
  apellidos: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;
  @ViewChild('testInput', { static: false }) testInput: ElementRef;

  constructor(
    private modalAsignacionUsuarioPersona: MatDialog,
    private modalAsignacionUsuarioTiposUsuario: MatDialog,
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
  ) {
    this.myForm = new FormGroup({
      _idUsuario: new FormControl(''),
      _idPersona: new FormControl(''),
      _cedula: new FormControl('', [Validators.required]),
      _nombres: new FormControl(''),
      _apellidos: new FormControl(''),
      _valorUsuario: new FormControl('', [Validators.required]),
      _contrasena: new FormControl('', [Validators.required]),
    })
  }

  botonInsertar = 'insertar';
  filterUsuario = '';

  inputType = 'password';
  resultadoModal: DialogData;
  nuevoUsuario = 'Nuevo Usuario';

  personas: Persona[] = [];
  usuarios: Usuario[] = [];

  consultarUsuarios() {
    this.usuarioService.consultarUsuarios(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.usuarios = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  mostrarContrasena() {
    if (this.inputType == 'password') {
      this.inputType = 'text';
    }
    else {
      this.inputType = 'password';
    }
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

  validacionFormulario() {
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == "insertar") {
        this.crearUsuario();
      } else if (this.testButton.nativeElement.value == "modificar") {
        this.actualizarUsuario();
        this.testButton.nativeElement.value = "insertar";
      }
    }
  }

  crearUsuario() {
    var datosUsuario = {
      idPersona: this._idPersona.value,
      usuario: this._valorUsuario.value,
      contrasena: this._contrasena.value,
      token: localStorage.getItem('miCuenta.postToken')
    }
    this.usuarioService.crearUsuario(datosUsuario)
      .then(
        ok => {
          if (ok['respuesta']) {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.consultarUsuarios();
          } else if (!ok['respuesta']) {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  actualizarUsuario() {
    this.usuarioService.actualizarUsuario(
      this._idUsuario.value,
      this._idPersona.value,
      this._valorUsuario.value,
      this._contrasena.value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          if (ok['respuesta']) {
            this.myForm.reset();
            this.consultarUsuarios();
            this.nuevoUsuario = 'Nuevo Usuario';
            this.testInput.nativeElement.disabled = false;
          }
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  habilitarUsuario(usuario) {
    this.usuarioService.habilitarUsuario(
      usuario.IdUsuario,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          this.consultarUsuarios();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  abrirModalAsignacionUsuarioPersona() {
    let dialogRef = this.modalAsignacionUsuarioPersona.open(ModalAsignacionUsuarioPersonaComponent, {
      width: '600px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this._cedula.setValue(result.cedula);
        this._idPersona.setValue(result.idPersona);
        this._nombres.setValue(result.nombres);
        this._apellidos.setValue(result.apellidos);
      }
    });
  }

  abrirModalAsignacionUsuarioTiposUsuario(usuario) {
    var listaTipoUsuario = usuario.ListaTipoUsuario;
    let dialogRef = this.modalAsignacionUsuarioTiposUsuario.open(ModalAsignacionUsuarioTiposUsuarioComponent, {
      width: '450px',
      height: 'auto',
      data: {
        idUsuario: usuario.IdUsuario,
        listaTipoUsuario: listaTipoUsuario,
      }
    });
  }

  eliminarUsuario(usuario) {
    var listaAsignacionTipoUsuario = usuario.ListaTipoUsuario;
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.usuarioService.eliminarUsuario(
            usuario.IdUsuario,
            localStorage.getItem('miCuenta.deleteToken'))
            .then(
              ok => {
                console.log(ok)
                listaAsignacionTipoUsuario.map(
                  item => {
                    this.eliminarAsignacionTipoUsuario(item.IdAsignacionTu);
                  }
                )
                this.consultarUsuarios();
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

  eliminarAsignacionTipoUsuario(idAsignacionTipoUsuario) {
    this.usuarioService.eliminarAsignacionTipoUsuario(
      idAsignacionTipoUsuario,
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
  }

  setUsuario(usuario) {
    this.testInput.nativeElement.disabled = true;
    this.nuevoUsuario = 'Modificar Usuario';
    this._idUsuario.setValue(usuario.IdUsuario);
    this._idPersona.setValue(usuario.IdPersona);
    this._nombres.setValue(usuario.PrimerNombre + ' ' + usuario.SegundoNombre);
    this._apellidos.setValue(usuario.ApellidoPaterno + ' ' + usuario.ApellidoMaterno);
    this._cedula.setValue(usuario.NumeroDocumento);
    this.testButton.nativeElement.value = 'modificar';
    this.myForm.setValue({
      _valorUsuario: usuario.UsuarioLogin,
      _contrasena: ''
    })
  }

  get _valorUsuario() {
    return this.myForm.get('_valorUsuario');
  }

  get _contrasena() {
    return this.myForm.get('_contrasena');
  }

  get _cedula() {
    return this.myForm.get('_cedula');
  }

  get _nombres() {
    return this.myForm.get('_nombres');
  }

  get _apellidos() {
    return this.myForm.get('_apellidos');
  }

  get _idPersona() {
    return this.myForm.get('_idPersona');
  }

  get _idUsuario() {
    return this.myForm.get('_idUsuario');
  }

  ngOnInit() {
    this.consultarUsuarios();
  }

  tablaUsuarios = ['usuario', 'nombres', 'acciones'];
}
