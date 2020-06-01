import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

// Components
import { ModalAsignacionUsuarioPersonaComponent } from "../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component";
import { ModalAsignacionUsuarioTiposUsuarioComponent } from "../modal-asignacion-usuario-tipos-usuario/modal-asignacion-usuario-tipos-usuario.component";
import { MatPaginator, MatTableDataSource } from "@angular/material";
// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { UsuarioService } from "src/app/services/usuario.service";
import { PersonaService } from "src/app/services/persona.service";

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
    private personaService: PersonaService
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

  consultarUsuarios() {
    this.usuarioService
      .consultarUsuarios()
      .then((ok) => {
        this.usuarios.data = ok["respuesta"];
        this.usuarios.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  mostrarContrasena() {
    if (this.inputType == "password") {
      this.inputType = "text";
    } else {
      this.inputType = "password";
    }
  }

  consultarPersonas() {
    this.personaService
      .consultarPersonas()
      .then((ok) => {
        this.personas = ok["respuesta"];
      })
      .catch((error) => console.log(error));
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

  crearUsuario() {
    var datosUsuario = {
      idPersona: this.myForm.get("_idPersona").value,
      usuario: this.myForm.get("_valorUsuario").value,
      contrasena: this.myForm.get("_contrasena").value,
      token: localStorage.getItem("miCuenta.postToken"),
    };
    this.usuarioService.crearUsuario(datosUsuario);
  }

  actualizarUsuario() {
    this.usuarioService
      .actualizarUsuario(
        this.myForm.get("_idUsuario").value,
        this.myForm.get("_idPersona").value,
        this.myForm.get("_valorUsuario").value,
        this.myForm.get("_contrasena").value
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          this.myForm.reset();
          this.consultarUsuarios();
          this.nuevoUsuario = "Nuevo Usuario";
          this.botonInsertar = "insertar";
        }
      })
      .catch((error) => console.log(error));
  }

  habilitarUsuario(usuario) {
    this.usuarioService
      .habilitarUsuario(usuario.IdUsuario)
      .then((ok) => this.consultarUsuarios())
      .catch((error) => console.log(error));
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
    var listaTipoUsuario = usuario.ListaTipoUsuario;
    let dialogRef = this.modalAsignacionUsuarioTiposUsuario.open(
      ModalAsignacionUsuarioTiposUsuarioComponent,
      {
        width: "500px",
        height: "auto",
        data: {
          idUsuario: usuario.IdUsuario,
          listaTipoUsuario: listaTipoUsuario,
        },
      }
    );
  }

  eliminarUsuario(usuario) {
    this.usuarioService.eliminarUsuario(usuario.IdUsuario);
  }

  eliminarAsignacionTipoUsuario(idAsignacionTipoUsuario) {
    this.usuarioService
      .eliminarAsignacionTipoUsuario(idAsignacionTipoUsuario)
      .catch((error) => console.log(error));
  }

  setUsuario(usuario) {
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

  ngOnInit() {
    this.consultarUsuarios();
  }

  tablaUsuarios = ["usuario", "nombres", "acciones"];
}
