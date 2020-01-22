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
    private modalDetalleUsuario: MatDialog,
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
  ) {
    this.myForm = new FormGroup({
      _valorUsuario: new FormControl('', [Validators.required]),
      _contrasena: new FormControl('', [Validators.required])
    })
  }

  botonInsertar = 'insertar';
  cedula = 'Cedula';
  nombres = 'Nombres';
  apellidos = 'Apellidos';
  filterUsuario = '';
  idAsignacionTipoUsuario: string;
  idPersona: string;
  idUsuario: string;
  idUsuarioModalAUP: string;
  inputPersona = true;
  inputUsuario = true;
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
    console.log(this.testButton.nativeElement.value);
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
    if (this.cedula == 'Cedula') {
      this.inputPersona = false;
    } else {
      var datosUsuario = {
        idPersona: this.idPersona,
        usuario: this.myForm.get('_valorUsuario').value,
        contrasena: this.myForm.get('_contrasena').value,
        token: localStorage.getItem('miCuenta.postToken')
      }
      this.usuarioService.crearUsuario(datosUsuario)
        .then(
          ok => {
            if (ok['respuesta']) {
              this.limpiarCampos();
              this.consultarUsuarios();
            } else {
              this.inputUsuario = false;
            }
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    }
  }

  actualizarUsuario() {
    console.log(this.idUsuario);
    console.log(this.myForm);
    this.usuarioService.actualizarUsuario(
      this.idUsuario,
      this.idPersona,
      this.myForm.get('_valorUsuario').value,
      this.myForm.get('_contrasena').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          console.log(ok['respuesta']);
          if (ok['respuesta']) {
            this.limpiarCampos();
            this.consultarUsuarios();
            this.nuevoUsuario = 'Nuevo Usuario';
            this.testInput.nativeElement.disabled = false;
          } else {
            this.inputUsuario = false;
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
      width: '900px',
      height: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.inputPersona = true;
        this.cedula = result.cedula;
        this.idPersona = result.idPersona;
        this.nombres = result.nombres;
        this.apellidos = result.apellidos;
      } else {
        this.inputPersona = false;
      }
    });
  }

  abrirModalAsignacionUsuarioTiposUsuario(usuario) {
    var listaTipoUsuario = usuario.ListaTipoUsuario;
    let dialogRef = this.modalAsignacionUsuarioTiposUsuario.open(ModalAsignacionUsuarioTiposUsuarioComponent, {
      width: '500px',
      height: '440px',
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

  onChangeInputUsuario() {
    this.inputUsuario = true;
  }

  limpiarCampos() {
    this.myForm.reset();
    this.cedula = 'Cedula';
    this.nombres = 'Nombres';
    this.apellidos = 'Apellidos';
    this.idPersona = '';
  }

  setUsuario(usuario) {
    this.testInput.nativeElement.disabled = true;
    this.nuevoUsuario = 'Modificar Usuario';
    if (!this.inputUsuario) {
      this.inputUsuario == false;
    }
    this.idUsuario = usuario.IdUsuario;
    this.idPersona = usuario.IdPersona;
    this.nombres = usuario.PrimerNombre + ' ' + usuario.SegundoNombre;
    this.apellidos = usuario.ApellidoPaterno + ' ' + usuario.ApellidoMaterno;
    this.cedula = usuario.NumeroDocumento;
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

  ngOnInit() {
    this.consultarUsuarios();
    console.log(localStorage.getItem('miCuenta.idAsignacionTipoUsuario'));
  }

  tablaUsuarios = ['usuario', 'nombres', 'acciones'];
}
