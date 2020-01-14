import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { UsuarioService } from 'src/app/services/usuario.service';

// Interfaces
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { Privilegios } from 'src/app/interfaces/privilegios/privilegios';

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Components
import { Modulo } from 'src/app/interfaces/modulo/modulo';
import { PersonaService } from 'src/app/services/persona.service';
import { Persona } from 'src/app/interfaces/persona/persona';


import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalAsignacionUsuarioPersonaComponent } from '../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component';
import { TipoDocumento } from 'src/app/interfaces/tipo-documento/tipo-documento';

export interface DialogData {
  cedula: string;
  idPersona: string;
}

export interface Fruit {
  name: string;
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
    private dialog: MatDialog,
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
  filterUsuario = '';
  idPersona: string;
  idUsuario: string;
  inputPersona = true;
  inputType = 'password';
  modulo = '0';
  privilegio = '0';
  tipoUsuario = '0';
  resultadoModal: DialogData;
  removableModulo = true;
  removablePrivilegio = true;
  selectableModulo = true;
  selectablePrivilegio = true;
  selectTipoUsuario = true;

  chipsPrivilegios: Privilegios[] = [];
  chipsModulos: Modulo[] = [];
  modulos: Modulo[] = [];
  personas: Persona[] = [];
  privilegios: Privilegios[] = [];
  tipoUsuarios: TipoDocumento[] = [];
  usuarios: Usuario[] = [];

  idAsignacionTipoUsuario: string;
  idTipoUsuario: string;

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

  consultarTipoUsuario() {
    this.usuarioService.consultarTipoUsuario(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoUsuarios = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarPrivilegios() {
    this.usuarioService.consultarPrivilegios(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.privilegios = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  consultarModulos() {
    this.usuarioService.consultarModulos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.modulos = ok['respuesta'];
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
        if (this.idTipoUsuario == this.tipoUsuario) {
          this.actualizarUsuario();
          this.consultarUsuarios();
        } else {
          this.actualizarUsuario();
          this.eliminarAsignacionTipoUsuario();
          this.asignarTipoUsuario(this.idUsuario);
          this.consultarUsuarios();
        }
        this.myForm.reset();
        this.testButton.nativeElement.value = "insertar";
      }
    }
  }

  crearUsuario() {
    if (this.cedula == 'Cedula') {
      if (this.tipoUsuario == '0') {
        this.selectTipoUsuario = false;
      }
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
            this.cedula = 'Cedula';
            this.asignarTipoUsuario(ok['respuesta']);
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    }
  }

  asignarTipoUsuario(idUsuario: string) {
    this.usuarioService.asignacionTipoUsuario(idUsuario, this.tipoUsuario, localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          this.limpiarCampos();
          this.consultarUsuarios();
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
      this.idUsuario,
      this.idPersona,
      this.myForm.get('_valorUsuario').value,
      this.myForm.get('_contrasena').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          this.cedula = 'Cedula';
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


  abrirModal() {
    let dialogRef = this.dialog.open(ModalAsignacionUsuarioPersonaComponent, {
      width: '900px',
      height: '500px',
      data: {
        cedula: this.cedula,
        idPersona: this.idPersona
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != null) {
        this.inputPersona = true;
        this.resultadoModal = result;
        console.log(this.resultadoModal);
        this.cedula = this.resultadoModal.cedula;
        this.idPersona = this.resultadoModal.idPersona;
      } else {
        this.inputPersona = false;
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
          this.eliminarAsignacionTipoUsuario();
          this.consultarUsuarios();
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  eliminarAsignacionTipoUsuario() {
    this.usuarioService.eliminarAsignacionTipoUsuario(
      this.idAsignacionTipoUsuario,
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
    this.idPersona = '';
    this.tipoUsuario = '0';
    this.modulo = '0';
    this.chipsPrivilegios = [];
  }

  setUsuario(
    idUsuario: string,
    usuarioLogin: string,
    idPersona: string,
    contrasena: string,
    idTipoUsuario: string,
    asignacionTipoUsuarioEntidad: string
  ) {
    this.idAsignacionTipoUsuario = asignacionTipoUsuarioEntidad['IdAsignacionTU'];
    this.idUsuario = idUsuario;
    this.idPersona = idPersona;
    this.testButton.nativeElement.value = 'modificar';
    this.tipoUsuario = idTipoUsuario;
    this.idTipoUsuario = idTipoUsuario;
    this.moduloDeUnTipoDeUsuario(this.idTipoUsuario);
    this.myForm.setValue({
      _valorUsuario: usuarioLogin,
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
    this.consultarTipoUsuario();
    //this.consultarModulos();
  }

  addPrivilegio(descripcion: string, idPrivilegios: string) {
    this.chipsPrivilegios.push({
      IdPrivilegios: idPrivilegios,
      Descripcion: descripcion
    });
  }

  removePrivilegio(privilegio) {
    const index = this.chipsPrivilegios.indexOf(privilegio);
    if (index >= 0) {
      this.chipsPrivilegios.splice(index, 1);
      this.privilegio = '0';
    }
  }

  privilegiosDeUnModuloTipo(value) {
    this.chipsPrivilegios = [];
    this.usuarioService.privilegiosDeUnModuloTipo(value, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          if (ok['respuesta'].length > 0) {
            for (let i of ok['respuesta']) {
              this.addPrivilegio(i.Descripcion, i.idPrivilegios);
            }
          }
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  moduloDeUnTipoDeUsuario(value) {
    if (value != "0") {
      this.selectTipoUsuario = true;
    }
    this.usuarioService.moduloDeUnTipoDeUsuario(value, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          if (ok['respuesta'].length > 0) {
            this.modulos = ok['respuesta'];
          } else {
            this.modulos = [];
            this.modulo = '0';
          }
          this.chipsPrivilegios = [];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }
}
