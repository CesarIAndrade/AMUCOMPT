import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
import { ModalDetalleUsuarioComponent } from '../modal-detalle-usuario/modal-detalle-usuario.component';

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
  idPersona: string;
  idUsuario: string;
  idUsuarioModalAUP: string;
  inputPersona = true;
  inputType = 'password';
  resultadoModal: DialogData;

  personas: Persona[] = [];
  usuarios: Usuario[] = [];

  idAsignacionTipoUsuario: string;

  consultarUsuarios() {
    console.log('consultando');
    this.usuarioService.consultarUsuarios(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.usuarios = ok['respuesta'];
          console.log(this.usuarios);
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
        err => console.log(err)
      )
  }

  validacionFormulario() {
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == "insertar") {
        this.crearUsuario();
      } else if (this.testButton.nativeElement.value == "modificar") {
        this.actualizarUsuario();
        this.myForm.reset();
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
            console.log(ok['respuesta']);
            this.limpiarCampos();
            this.myForm.reset();
            this.consultarUsuarios();
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
    this.usuarioService.actualizarUsuario(
      this.idUsuario,
      this.idPersona,
      this.myForm.get('_valorUsuario').value,
      this.myForm.get('_contrasena').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          this.limpiarCampos();
          this.consultarUsuarios();
          this.testButton.nativeElement.value = 'insertar';
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  habilitarUsuario() {
    this.usuarioService.habilitarUsuario(
      this.idUsuarioModalAUP,
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
      height: '500px',
      data: {
        cedula: this.cedula,
        idPersona: this.idPersona,
        idUsuario: this.idUsuarioModalAUP,
        nombres: this.nombres,
        apellidos: this.apellidos
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != null) {
        console.log(result);
        this.inputPersona = true;
        this.resultadoModal = result;
        this.cedula = this.resultadoModal.cedula;
        this.idPersona = this.resultadoModal.idPersona;
        this.nombres = this.resultadoModal.nombres;
        this.apellidos = this.resultadoModal.apellidos;
        if (result.idUsuario == null) {
          this.idUsuarioModalAUP = '';
        } else {
          this.idUsuarioModalAUP = result.idUsuario;
        }
      } else {
        this.inputPersona = false;
      }
    });
  }

  abrirModalAsignacionUsuarioTiposUsuario(usuario) {
    console.log(usuario);
    var listaTipoUsuario = usuario.ListaTipoUsuario;
    let dialogRef = this.modalAsignacionUsuarioTiposUsuario.open(ModalAsignacionUsuarioTiposUsuarioComponent, {
      width: '900px',
      height: '500px',
      data: {
        idUsuario: usuario.IdUsuario,
        listaTipoUsuario: listaTipoUsuario,
      }
    });
  }

  abrirModalDetalleUsuario(usuario){
    var listaTipoUsuario = usuario.ListaTipoUsuario;
    console.log(usuario);
    let dialogRef = this.modalDetalleUsuario.open(ModalDetalleUsuarioComponent, {
      width: '500px',
      height: '300px',
      data: {
        listaTipoUsuario: listaTipoUsuario
      }
    });
  }

  eliminarUsuario(usuario) {
    this.idAsignacionTipoUsuario = usuario.AsignacionTipoUsuarioEntidad.IdAsignacionTU;
    this.usuarioService.eliminarUsuario(
      usuario.IdUsuario,
      localStorage.getItem('miCuenta.deleteToken'))
      .then(
        ok => {
          this.consultarUsuarios();
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  limpiarCampos() {
    this.myForm.reset();
    this.cedula = 'Cedula';
    this.nombres = 'Nombres';
    this.apellidos = 'Apellidos';
    this.idPersona = '';
  }

  setUsuario(usuario) {
    console.log(usuario);
    this.idUsuario = usuario.IdUsuario;
    this.idPersona = usuario.IdPersona;
    this.nombres = usuario.PrimerNombre +' '+ usuario.SegundoNombre;
    this.apellidos = usuario.ApellidoPaterno +' '+ usuario.ApellidoMaterno;
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
  }
}
