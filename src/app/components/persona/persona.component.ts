import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

// Components
import { ModalDetallePersonaComponent } from "src/app/components/modal-detalle-persona/modal-detalle-persona.component";
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar,
} from "@angular/material";
// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { PersonaService } from "../../services/persona.service";
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

@Component({
  selector: "app-persona",
  templateUrl: "./persona.component.html",
  styleUrls: ["./persona.component.css"],
})
export class PersonaComponent implements OnInit {
  constructor(
    private personaService: PersonaService,
    private panelAdministracionService: PanelAdministracionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _nombres: new FormControl("", [Validators.required]),
      _apellidos: new FormControl("", [Validators.required]),
      _numeroDocumento: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
      ]),
      _telefono1: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
      ]),
      _telefono2: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
      ]),
      _correo: new FormControl("", [Validators.email]),
      _tipoDocumento: new FormControl("", [Validators.required]),
      _tipoTelefono1: new FormControl("", [Validators.required]),
      _tipoTelefono2: new FormControl("", [Validators.required]),
      _provincia: new FormControl("", [Validators.required]),
      _canton: new FormControl("", [Validators.required]),
      _parroquia: new FormControl("", [Validators.required]),
      _idCorreo: new FormControl(""),
      _idAsignacionPersonaParroquia: new FormControl(""),
      _idPersona: new FormControl(""),
      _idTelefono1: new FormControl(""),
      _idTelefono2: new FormControl(""),
      _referencia: new FormControl("", [Validators.required])
    });
  }

  @Input() llamadaModal = "false";

  get _correo() {
    return this.myForm.get("_correo");
  }

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  personas = new MatTableDataSource<Element[]>();

  myForm: FormGroup;
  botonInsertar = "insertar";
  contacto = "Contacto ";
  direccion = "Direccion";
  filterPersona = "";
  guardar = "Guardar";
  nuevaPersona = "Nueva Persona";

  cantones: any[] = [];
  parroquias: any[] = [];
  personaModal: any = {};
  provincias: any[] = [];
  telefonos: any[] = [];
  tipoDocumentos: any[] = [];
  tipoTelefonos: any[] = [];

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

  async consultarProvincias() {
    var provincias = await this.panelAdministracionService.consultarProvincias();
    if (provincias["codigo"] == "200") {
      this.provincias = provincias["respuesta"];
    }
  }

  async consultarPersonas() {
    var respuesta = await this.personaService.consultarPersonas();
    if (respuesta["codigo"] == "200") {
      var personas: any = [];
      respuesta["respuesta"].map((persona) => {
        persona.Acciones = this.llamadaModal;
        personas.push(persona);
      });
      this.personas.data = personas;
      this.personas.paginator = this.paginator;
    }
  }

  async consultarTipoDocumento() {
    var tipoDocumentos = await this.personaService.consultarTipoDocumento();
    if (tipoDocumentos["codigo"] == "200") {
      this.tipoDocumentos = tipoDocumentos["respuesta"];
    }
  }

  async consultarTipoTelefono() {
    var tipoTelefonos = await this.personaService.consultarTipoTelefono();
    if (tipoTelefonos["codigo"] == "200") {
      this.tipoTelefonos = tipoTelefonos["respuesta"];
    }
  }

  async consultarCantonesDeUnaProvincia(idProvincia: string, flag?) {
    var respuesta = await this.panelAdministracionService.consultarCantonesDeUnaProvincia(
      idProvincia
    );
    if (respuesta["codigo"] == "200") {
      this.cantones = respuesta["respuesta"];
      if (flag) {
        this.myForm.get("_canton").setValue("0");
        this.myForm.get("_parroquia").setValue("0");
      }
    }
  }

  async consultarParroquiasDeUnCanton(idCanton: string, flag?) {
    var respuesta = await this.panelAdministracionService.consultarParroquiasDeUnCanton(
      idCanton
    );
    if (respuesta["codigo"] == "200") {
      this.parroquias = respuesta["respuesta"];
      if (flag) {
        this.myForm.get("_parroquia").setValue("0");
      }
    }
  }

  validarNombresYApellidos(flag) {
    var campos: any;
    var tipo: string;
    if (flag) {
      campos = this.myForm.get("_nombres").value.split(" ");
      tipo = "nombres";
    } else {
      campos = this.myForm.get("_apellidos").value.split(" ");
      tipo = "apellidos";
    }
    if (campos.length == 1) {
      this.openDialog(`Necesita dos ${tipo}`);
    } else if (campos.length >= 2) {
      if (campos[0].length > 0 && campos[1].length > 0) {
        var nombresYApellidos = {
          primerCampo: campos[0],
          segundoCampo: campos[1],
          valido: true,
        };
        return nombresYApellidos;
      } else {
        this.openDialog(`Necesita dos ${tipo}`);
      }
    }
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonInsertar == "insertar") {
        this.crearPersona();
      } else if (this.botonInsertar == "modificar") {
        this.actualizarPersona();
      }
    }
  }

  async crearPersona() {
    var dosNombres = this.validarNombresYApellidos(true);
    var dosApellidos = this.validarNombresYApellidos(false);
    if (dosNombres && dosApellidos) {
      var respuesta = await this.personaService.crearPersona(
        this.myForm.get("_numeroDocumento").value,
        this.myForm.get("_tipoDocumento").value,
        dosApellidos.primerCampo,
        dosApellidos.segundoCampo,
        dosNombres.primerCampo,
        dosNombres.segundoCampo,
        this.myForm.get("_telefono1").value,
        this.myForm.get("_tipoTelefono1").value,
        this.myForm.get("_telefono2").value,
        this.myForm.get("_tipoTelefono2").value,
        this.myForm.get("_correo").value,
        this.myForm.get("_parroquia").value,
        this.myForm.get("_referencia").value,
      );
      console.log(respuesta);
      if (respuesta["codigo"] == "200") {
        this.openSnackBar("Se ingresó correctamente");
        var personas: any = this.personas.data;
        respuesta["respuesta"].Acciones = this.llamadaModal;
        personas.push(respuesta["respuesta"]);
        this.personas.data = personas;
        this.myForm.reset();
      } else if (respuesta["codigo"] == "400") {
        this.openDialog("Inténtalo de nuevo");
      } else if (respuesta["codigo"] == "418") {
        this.openDialog(respuesta["mensaje"]);
      } else if (respuesta["codigo"] == "500") {
        this.openDialog("Problemas con el servidor");
      }
    }
  }

  abrirModal(persona) {
    let dialogRef = this.dialog.open(ModalDetallePersonaComponent, {
      width: "500px",
      height: "auto",
      data: {
        persona: persona,
      },
    });
  }

  mostrarPersona(persona) {
    console.log(persona);
    this.nuevaPersona = "Modificar Persona";
    this.contacto = "Modificar Contacto";
    this.direccion = "Modificar Direccion";
    this.guardar = "Modificar";
    this.myForm.get("_idPersona").setValue(persona.IdPersona);
    var nombres = persona.PrimerNombre + " " + persona.SegundoNombre;
    var apellidos = persona.ApellidoPaterno + " " + persona.ApellidoMaterno;
    if (persona.ListaCorreo.length == 0) {
      this.myForm.get("_idCorreo").setValue("");
      this.myForm.get("_correo").setValue("");
    } else {
      this.myForm.get("_idCorreo").setValue(persona.ListaCorreo[0].IdCorreo);
      this.myForm.get("_correo").setValue(persona.ListaCorreo[0].CorreoValor);
    }
    this.myForm.get("_nombres").setValue(nombres);
    this.myForm.get("_apellidos").setValue(apellidos);
    this.myForm.get("_tipoDocumento").setValue(persona.IdTipoDocumento);
    this.myForm.get("_numeroDocumento").setValue(persona.NumeroDocumento);
    this.myForm
      .get("_idTelefono1")
      .setValue(persona.ListaTelefono[0].IdTelefono);
    this.myForm.get("_telefono1").setValue(persona.ListaTelefono[0].Numero);
    this.myForm
      .get("_tipoTelefono1")
      .setValue(persona.ListaTelefono[0].TipoTelefono.IdTipoTelefono);
    this.myForm
      .get("_idTelefono2")
      .setValue(persona.ListaTelefono[1].IdTelefono);
    this.myForm.get("_telefono2").setValue(persona.ListaTelefono[1].Numero);
    this.myForm
      .get("_tipoTelefono2")
      .setValue(persona.ListaTelefono[1].TipoTelefono.IdTipoTelefono);
    this.myForm
      .get("_provincia")
      .setValue(
        persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Provincia
          .IdProvincia
      );
    this.consultarCantonesDeUnaProvincia(this.myForm.get("_provincia").value);
    this.myForm.get("_canton").setValue(
      persona.AsignacionPersonaParroquia[0].Parroquia.Canton.IdCanton
    );
    this.consultarParroquiasDeUnCanton(this.myForm.get("_canton").value);
    this.myForm
      .get("_parroquia")
      .setValue(persona.AsignacionPersonaParroquia[0].Parroquia.IdParroquia);
      this.myForm
      .get("_referencia")
      .setValue(persona.AsignacionPersonaParroquia[0].Referencia);
    this.botonInsertar = "modificar";
  }

  async actualizarPersona() {
    var dosNombres = this.validarNombresYApellidos(true);
    var dosApellidos = this.validarNombresYApellidos(false);
    if (dosNombres && dosApellidos) {
      var respuesta = await this.personaService.actualizarPersona(
        this.myForm.get("_idPersona").value,
        this.myForm.get("_numeroDocumento").value,
        this.myForm.get("_tipoDocumento").value,
        dosApellidos.primerCampo,
        dosApellidos.segundoCampo,
        dosNombres.primerCampo,
        dosNombres.segundoCampo,
        this.myForm.get("_idTelefono1").value,
        this.myForm.get("_telefono1").value,
        this.myForm.get("_tipoTelefono1").value,
        this.myForm.get("_idTelefono2").value,
        this.myForm.get("_telefono2").value,
        this.myForm.get("_tipoTelefono2").value,
        this.myForm.get("_correo").value,
        this.myForm.get("_parroquia").value,
        this.myForm.get("_referencia").value,
      );
      console.log(respuesta);
      if(respuesta["codigo"] == "200") {
        this.openSnackBar("Se actualizó correctamente");
        var personas: any = this.personas.data;
        var persona = personas.find(
          persona => persona["IdPersona"] == this.myForm.get("_idPersona").value
        );
        var index = personas.indexOf(persona);
        personas.splice(index, 1);
        respuesta["respuesta"].Acciones = this.llamadaModal;
        personas.push(respuesta["respuesta"]);
        this.personas.data = personas;
        this.nuevaPersona = "Nueva Persona"
        this.contacto = "Contacto ";
        this.direccion = "Direccion";
        this.guardar = "Guardar";
        this.botonInsertar = "insertar";
        this.myForm.reset();
      } else if (respuesta["codigo"] == "400") {
        this.openDialog("Inténtalo de nuevo");
      } else if (respuesta["codigo"] == "418") {
        this.openDialog(respuesta["mensaje"]);
      } else if (respuesta["codigo"] == "500") {
        this.openDialog("Problemas con el servidor");
      }
    }
  }

  @Output() obtenerPersona = new EventEmitter();
  seleccionarPersona(persona) {
    this.obtenerPersona.emit(persona);
  }

  cancelar() {
    this.myForm.reset();
  }

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
  }

  tablaPersonas = [
    "nombres",
    "apellidos",
    "documento",
    "numeroDocumento",
    "acciones",
  ];
  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
