import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

// Components
import { ModalAsignacionUsuarioPersonaComponent } from "../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component";
import { ModalAsignacionUsuarioTiposUsuarioComponent } from "../modal-asignacion-usuario-tipos-usuario/modal-asignacion-usuario-tipos-usuario.component";
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar,
} from "@angular/material";
// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { UsuarioService } from "src/app/services/usuario.service";
import { PersonaService } from "src/app/services/persona.service";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.css"],
})
export class UsuarioComponent implements OnInit {
  constructor(
    private modalAsignacionUsuarioPersona: MatDialog,
    private modalAsignacionUsuarioTiposUsuario: MatDialog,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idUsuario: new FormControl(""),
      _idPersona: new FormControl("", [Validators.required]),
      _cedula: new FormControl(""),
      _nombres: new FormControl(""),
      _apellidos: new FormControl(""),
      _valorUsuario: new FormControl("", [Validators.required]),
      _contrasena: new FormControl("", [Validators.required]),
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
  filterUsuario = "";

  personas: any[] = [];

  openDialog(mensaje): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: { mensaje: mensaje },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 2000,
      horizontalPosition: "right",
    });
  }

  async consultarUsuarios() {
    var usuarios = await this.usuarioService.consultarUsuarios();
    console.log(usuarios);
    if (usuarios["codigo"] == "200") {
      this.usuarios.data = usuarios["respuesta"];
      this.usuarios.paginator = this.paginator;
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
      this.openSnackBar("Se ingresó correctamente");
      var usuarios: any = this.usuarios.data;
      usuarios.push(respuesta["respuesta"]);
      this.usuarios.data = usuarios;
      this.myForm.reset();
    }
  }

  async actualizarUsuario() {
    var respuesta = await this.usuarioService.actualizarUsuario(
      this.myForm.get("_idUsuario").value,
      this.myForm.get("_idPersona").value,
      this.myForm.get("_valorUsuario").value,
      this.myForm.get("_contrasena").value
    );
    if (respuesta["codigo"] == "200") {
      this.openSnackBar("Se actualizó correctamente");
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
    let dialogRef = this.modalAsignacionUsuarioPersona.open(
      ModalAsignacionUsuarioPersonaComponent,
      {
        width: "700px",
        height: "auto",
      }
    );
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
    let dialogRef = this.modalAsignacionUsuarioTiposUsuario.open(
      ModalAsignacionUsuarioTiposUsuarioComponent,
      {
        width: "500px",
        height: "auto",
        data: {
          idUsuario: usuario.IdUsuario,
        },
        // disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        console.log(result);
        this.openDialog(result);
        this.consultarUsuarios();
      }
    });
  }

  async eliminarUsuario(usuario) {
    var respuesta = await this.usuarioService.eliminarUsuario(
      usuario.IdUsuario
    );
    if(respuesta["codigo"] == "200") {
      this.consultarUsuarios();
    }
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

  ngOnInit() {
    this.consultarUsuarios();
  }

  tablaUsuarios = ["usuario", "nombres", "acciones"];
}
