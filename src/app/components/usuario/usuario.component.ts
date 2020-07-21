import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { salir, openDialog, openSnackBar } from '../../functions/global';
import { Router } from '@angular/router';

// Components
import { ModalAsignacionUsuarioPersonaComponent } from "../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component";
import { ModalAsignacionUsuarioTiposUsuarioComponent } from "../modal-asignacion-usuario-tipos-usuario/modal-asignacion-usuario-tipos-usuario.component";
import { ModalReasignarClientesComponent } from "../modal-reasignar-clientes/modal-reasignar-clientes.component";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

// Material
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar,
} from "@angular/material";
import { MatDialog } from "@angular/material/dialog";

// Services
import { UsuarioService } from "src/app/services/usuario.service";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.css"],
})
export class UsuarioComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idUsuario: new FormControl(""),
      _idPersona: new FormControl("", [Validators.required]),
      _cedula: new FormControl(""),
      _nombres: new FormControl(""),
      _apellidos: new FormControl(""),
      _valorUsuario: new FormControl("", [Validators.required]),
      _contrasena: new FormControl("", [Validators.required, Validators.minLength(8)]),
    });
  }

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  usuarios = new MatTableDataSource<Element[]>();

  myForm: FormGroup;
  resultadoModal: any;
  botonInsertar = "insertar";
  inputType = "password";
  nuevoUsuario = "Nuevo Usuario";
  personas: any[] = [];
  usuario: any;

  async consultarUsuarios() {
    var respuesta = await this.usuarioService.consultarUsuarios();
    if (respuesta["codigo"] == "200") {
      var usuarios = [];
      for (let usuario of respuesta["respuesta"]) {
        if (usuario.IdUsuario == this.usuario.IdUsuario) {
          continue;
        } else {
          usuarios.push(usuario);
        }
      }
      this.usuarios.data = usuarios;
      this.usuarios.paginator = this.paginator;
    } else if (respuesta["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir())
    }
  }

  mostrarContrasena() {
    if (this.inputType == "password") {
      this.inputType = "text";
    } else {
      this.inputType = "password";
    }
  }

  validacionFormulario() {
    if (this.myForm.valid) {
      if (this.botonInsertar == "insertar") {
        this.crearUsuario();
      } else if (this.botonInsertar == "modificar") {
        this.actualizarUsuario();
      }
    }
  }

  async crearUsuario() {
    var respuesta = await this.usuarioService.crearUsuario(
      this.myForm.get("_idPersona").value,
      this.myForm.get("_valorUsuario").value,
      this.myForm.get("_contrasena").value
    );
    if (respuesta["codigo"] == "200") {
      openSnackBar("Se ingresó correctamente", this.snackBar);
      var usuarios: any = this.usuarios.data;
      usuarios.push(respuesta["respuesta"]);
      this.usuarios.data = usuarios;
      this.myForm.reset();
    } else if (respuesta["codigo"] == "418") {
      openDialog(respuesta["mensaje"], "advertencia", this.dialog);
    }
  }

  async actualizarUsuario() {
    var respuesta = await this.usuarioService.actualizarUsuario(
      this.myForm.get("_idUsuario").value,
      this.myForm.get("_idPersona").value,
      this.myForm.get("_valorUsuario").value,
      this.myForm.get("_contrasena").value,
      "0"
    );
    if (respuesta["codigo"] == "200") {
      openSnackBar("Se actualizó correctamente", this.snackBar);
      var usuarios: any = this.usuarios.data;
      var usuario = usuarios.find(
        (usuario) => usuario["IdUsuario"] == this.myForm.get("_idUsuario").value
      );
      var index = usuarios.indexOf(usuario);
      usuarios.splice(index, 1);
      usuarios.push(respuesta["respuesta"]);
      this.usuarios.data = usuarios;
      this.nuevoUsuario = "Nuevo Usuario";
      this.botonInsertar = "insertar";
      this.myForm.reset();
    }
  }

  async habilitarUsuario(usuario) {
    var respuesta = await this.usuarioService.habilitarUsuario(
      usuario.IdUsuario
    );
    if (respuesta["codigo"] == "200") {
      this.consultarUsuarios();
    }
  }

  abrirModalAsignacionUsuarioPersona() {
    let dialogRef = this.dialog.open(ModalAsignacionUsuarioPersonaComponent, {
      width: "700px",
      height: "auto",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_cedula").setValue(result.cedula);
        this.myForm.get("_idPersona").setValue(result.idPersona);
        this.myForm.get("_nombres").setValue(result.nombres);
        this.myForm.get("_apellidos").setValue(result.apellidos);
      }
    });
  }

  abrirModalAsignacionUsuarioTiposUsuario(usuario) {
    let dialogRef = this.dialog.open(
      ModalAsignacionUsuarioTiposUsuarioComponent,
      {
        width: "auto",
        height: "auto",
        data: {
          usuario: usuario,
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        openDialog(result, "success", this.dialog);
        this.consultarUsuarios();
      }
    });
  }
 
  async eliminarUsuario(usuario, flag?) {
    if (flag) {
      var respuesta = await this.usuarioService.eliminarUsuario(
        usuario.IdUsuario
      );
      if (respuesta["codigo"] == "200") {
        this.consultarUsuarios();
      }
    } else {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "250px",
        height: "auto",
        data: {
          mensaje: "",
        },
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          var respuesta = await this.usuarioService.eliminarUsuario(
            usuario.IdUsuario
          );
          if (respuesta["codigo"] == "200") {
            this.consultarUsuarios();
          } else if (respuesta["codigo"] == "409") {
            this.reasignarClientes(usuario);
          }
        }
      });
    }
  }

  reasignarClientes(usuario) {
    const dialogRef = this.dialog.open(ModalReasignarClientesComponent, {
      width: "auto",
      height: "auto",
      data: {
        usuario: usuario,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result.flag) {
          this.eliminarUsuario(result.usuario, result.flag);
        }
      }
    });
  }

  mostrarUsuario(usuario) {
    this.nuevoUsuario = "Modificar Usuario";
    this.myForm.get("_idUsuario").setValue(usuario.IdUsuario);
    this.myForm.get("_idPersona").setValue(usuario.IdPersona);
    this.myForm
      .get("_nombres")
      .setValue(usuario.PrimerNombre + " " + usuario.SegundoNombre);
    this.myForm
      .get("_apellidos")
      .setValue(usuario.ApellidoPaterno + " " + usuario.ApellidoMaterno);
    this.myForm.get("_cedula").setValue(usuario.NumeroDocumento);
    this.botonInsertar = "modificar";
    this.myForm.get("_valorUsuario").setValue(usuario.UsuarioLogin);
    this.myForm.get("_contrasena").setValue("");
  }

  cancelar() {
    this.myForm.reset();
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.usuarios.filter = term;
  } 

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.consultarUsuarios();
  }

  tablaUsuarios = ["usuario", "nombres", "acciones"];
}
