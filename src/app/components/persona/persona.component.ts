import { Component, OnInit, ViewChild, Input } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { Router } from "@angular/router";
import { salir, openDialog, openSnackBar } from "../../functions/global";

// Material
import { MatDialog } from "@angular/material/dialog";
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar,
} from "@angular/material";
import { ErrorStateMatcher } from "@angular/material/core";

// Services
import { PersonaService } from "../../services/persona.service";
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

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
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      // _nombres: new FormControl("", [Validators.required]),
      // _apellidos: new FormControl("", [Validators.required]),
      _nombres: new FormControl(""),
      _apellidos: new FormControl(""),

      _numeroDocumento: new FormControl(""),
      _telefono1: new FormControl(""),
      _telefono2: new FormControl(""),

      // _correo: new FormControl("", [Validators.email]),
      // _tipoDocumento: new FormControl("", [Validators.required]),
      // _tipoTelefono1: new FormControl("", [Validators.required]),
      _correo: new FormControl("", [Validators.email]),
      _tipoDocumento: new FormControl(""),
      _tipoTelefono1: new FormControl(""),

      _tipoTelefono2: new FormControl(""),

      // _provincia: new FormControl("", [Validators.required]),
      // _canton: new FormControl("", [Validators.required]),
      // _parroquia: new FormControl("", [Validators.required]),
      _provincia: new FormControl(""),
      _canton: new FormControl(""),
      _parroquia: new FormControl(""),

      _idCorreo: new FormControl(""),
      _idAsignacionPersonaParroquia: new FormControl(""),
      _idPersona: new FormControl(""),
      _idTelefono1: new FormControl(""),
      _idTelefono2: new FormControl(""),

      // _referencia: new FormControl("", [Validators.required]),
      _referencia: new FormControl(""),
    });
  }

  @Input() renderizarTablaOriginal = "true";
  mostrarEnModuloPersona = true;
  claseParaModuloPersona = "col-lg-4";

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
  digitosTelefono1 = "0";
  digitosTelefono2 = "0";
  digitosNumeroDocumento = "0";
  mostrarTablaPersonasEnVista = false;
  comboProvincia = true;
  comboCanton = false;
  comboParroquia = false;

  cantones: any[] = [];
  parroquias: any[] = [];
  personaModal: any = {};
  provincias: any[] = [];
  telefonos: any[] = [];
  tipoDocumentos: any[] = [];
  tipoTelefonos: any[] = [];

  async consultarProvincias() {
    var provincias = await this.panelAdministracionService.consultarProvincias();
    if (provincias["codigo"] == "200") {
      this.comboProvincia = false;
      this.provincias = provincias["respuesta"];
    }
  }

  comboTipoDocumento = true;
  async consultarTipoDocumento() {
    var tipoDocumentos = await this.personaService.consultarTipoDocumento();
    if (tipoDocumentos["codigo"] == "200") {
      this.comboTipoDocumento = false;
      this.myForm.get("_tipoDocumento").enable();
      this.tipoDocumentos = tipoDocumentos["respuesta"];
    } else if (tipoDocumentos["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir());
    }
  }

  comboTipoTelefono = true;
  async consultarTipoTelefono() {
    var tipoTelefonos = await this.personaService.consultarTipoTelefono();
    if (tipoTelefonos["codigo"] == "200") {
      this.comboTipoTelefono = false;
      this.myForm.get("_tipoTelefono1").enable();
      this.myForm.get("_tipoTelefono2").enable();
      this.tipoTelefonos = tipoTelefonos["respuesta"];
    }
  }

  async consultarCantonesDeUnaProvincia(idProvincia: string, flag?) {
    this.comboCanton = true;
    var respuesta = await this.panelAdministracionService.consultarCantonesDeUnaProvincia(
      idProvincia
    );
    if (respuesta["codigo"] == "200") {
      this.comboCanton = false;
      this.cantones = respuesta["respuesta"];
      if (flag) {
        this.myForm.get("_canton").setValue("0");
        this.myForm.get("_parroquia").setValue("0");
      }
    }
  }

  async consultarParroquiasDeUnCanton(idCanton: string, flag?) {
    this.comboParroquia = true;
    var respuesta = await this.panelAdministracionService.consultarParroquiasDeUnCanton(
      idCanton
    );
    if (respuesta["codigo"] == "200") {
      this.comboParroquia = false;
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
      openDialog(`Necesita dos ${tipo}`, "advertencia", this.dialog);
    } else if (campos.length >= 2) {
      if (campos[0].length > 0 && campos[1].length > 0) {
        var nombresYApellidos = {
          primerCampo: campos[0],
          segundoCampo: campos[1],
          valido: true,
        };
        return nombresYApellidos;
      } else {
        openDialog(`Necesita dos ${tipo}`, "advertencia", this.dialog);
      }
    }
  }

  seleccionarTipoDocumento(IdTipoDocumento) {
    var tipo = this.tipoDocumentos.find(
      (tipo) => tipo.IdTipoDocumento == IdTipoDocumento
    );
    this.myForm.get("_numeroDocumento").enable();
    this.myForm.get("_numeroDocumento").setValidators([]);
    if (tipo.Documento == "CEDULA") {
      this.myForm
        .get("_numeroDocumento")
        .setValidators([
          Validators.required,
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
          Validators.maxLength(10),
          Validators.minLength(10),
        ]);
      this.myForm.get("_numeroDocumento").updateValueAndValidity();
      this.digitosNumeroDocumento = "10";
    } else if (tipo.Documento == "RUC") {
      this.myForm
        .get("_numeroDocumento")
        .setValidators([
          Validators.required,
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
          Validators.maxLength(13),
          Validators.minLength(13),
        ]);
      this.myForm.get("_numeroDocumento").updateValueAndValidity();
      this.digitosNumeroDocumento = "13";
    } else if (tipo.Documento == "PASAPORTE") {
      this.myForm
        .get("_numeroDocumento")
        .setValidators([Validators.required, Validators.minLength(4)]);
      this.myForm.get("_numeroDocumento").updateValueAndValidity();
      this.digitosNumeroDocumento = "";
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
        this.myForm.get("_referencia").value
      );
      console.log(respuesta);
      if (respuesta["codigo"] == "200") {
        openSnackBar("Se ingresó correctamente", this.snackBar);
        this.personaService.refresh$.emit();
        var personas: any = this.personas.data;
        respuesta["respuesta"].Acciones = this.renderizarTablaOriginal;
        personas.push(respuesta["respuesta"]);
        this.personas.data = personas;
        this.myForm.get("_telefono1").disable();
        this.myForm.get("_telefono2").disable();
        this.myForm.get("_numeroDocumento").disable();
        this.digitosTelefono1 = "0";
        this.digitosTelefono2 = "0";
        this.digitosNumeroDocumento = "0";
        this.myForm.reset();
      } else if (respuesta["codigo"] == "400") {
        openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
      } else if (respuesta["codigo"] == "418") {
        openDialog(respuesta["mensaje"], "advertencia", this.dialog);
      } else if (respuesta["codigo"] == "500") {
        openDialog("Problemas con el servidor", "advertencia", this.dialog);
      }
    }
  }

  minTelefono1 = 0;
  minTelefono2 = 0;
  seleccionarTipoTelefono(IdTipoTelefono, suffix, flag) {
    var tipo = this.tipoTelefonos.find(
      (tipo) => tipo.IdTipoTelefono == IdTipoTelefono
    );
    this.myForm.get(`_telefono${suffix}`).enable();
    this.myForm.get(`_telefono${suffix}`).setValidators([]);
    if (tipo.Descripcion == "CELULAR") {
      this.myForm
        .get(`_telefono${suffix}`)
        .setValidators([
          Validators.required,
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
          Validators.maxLength(10),
          Validators.minLength(10),
        ]);
      this.myForm.get(`_telefono${suffix}`).updateValueAndValidity();
      suffix == 1
        ? (this.digitosTelefono1 = "10")
        : (this.digitosTelefono2 = "10");
    } else {
      this.myForm
        .get(`_telefono${suffix}`)
        .setValidators([
          Validators.required,
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
          Validators.minLength(7),
        ]);
      this.myForm.get(`_telefono${suffix}`).updateValueAndValidity();
      if (suffix === 1) {
        this.digitosTelefono1 = "";
        this.minTelefono1 = 7;
      } else {
        this.digitosTelefono2 = "";
        this.minTelefono2 = 7;
      }
      if (flag) {
        this.myForm.get(`_telefono${suffix}`).reset();
      }
    }
  }

  mostrarPersona(persona) {
    console.log(persona);
    this.myForm.reset();
    try {
      persona.ListaTelefono.map((telefono, index) => {
        this.myForm.get(`_idTelefono${index + 1}`).setValue(telefono.IdTelefono);
        this.myForm.get(`_telefono${index + 1}`).setValue(telefono.Numero);
        this.myForm
          .get(`_tipoTelefono${index + 1}`)
          .setValue(telefono.TipoTelefono.IdTipoTelefono);
        this.seleccionarTipoTelefono(
          telefono.TipoTelefono.IdTipoTelefono,
          index + 1,
          false
        );
      });
      if (persona.ListaCorreo.length == 0) {
        this.myForm.get("_idCorreo").setValue("");
        this.myForm.get("_correo").setValue("");
      } else {
        this.myForm.get("_idCorreo").setValue(persona.ListaCorreo[0].IdCorreo);
        this.myForm.get("_correo").setValue(persona.ListaCorreo[0].CorreoValor);
      }
      this.myForm.get("_telefono1").enable();
      this.myForm.get("_telefono2").enable();
      this.myForm
        .get("_provincia")
        .setValue(
          persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Provincia
            .IdProvincia
        );
      this.consultarCantonesDeUnaProvincia(this.myForm.get("_provincia").value);
      this.myForm
        .get("_canton")
        .setValue(
          persona.AsignacionPersonaParroquia[0].Parroquia.Canton.IdCanton
        );
      this.consultarParroquiasDeUnCanton(this.myForm.get("_canton").value);
      this.myForm
        .get("_parroquia")
        .setValue(persona.AsignacionPersonaParroquia[0].Parroquia.IdParroquia);
      this.myForm
        .get("_referencia")
        .setValue(persona.AsignacionPersonaParroquia[0].Referencia);
    } catch (error) {}


    this.myForm.get("_numeroDocumento").enable();
    this.nuevaPersona = "Modificar Persona";
    this.contacto = "Modificar Contacto";
    this.direccion = "Modificar Direccion";
    this.guardar = "Modificar";
    this.myForm.get("_idPersona").setValue(persona.IdPersona);
    var nombres = persona.PrimerNombre + " " + persona.SegundoNombre;
    var apellidos = persona.ApellidoPaterno + " " + persona.ApellidoMaterno;
    this.myForm.get("_nombres").setValue(nombres);
    this.myForm.get("_apellidos").setValue(apellidos);
    this.myForm.get("_tipoDocumento").setValue(persona.IdTipoDocumento);
    this.seleccionarTipoDocumento(persona.IdTipoDocumento);
    this.myForm.get("_numeroDocumento").setValue(persona.NumeroDocumento);

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
        this.myForm.get("_referencia").value
      );
      console.log(respuesta);
      if (respuesta["codigo"] == "200") {
        openSnackBar("Se actualizó correctamente", this.snackBar);
        this.personaService.refresh$.emit();
        var personas: any = this.personas.data;
        var persona = personas.find(
          (persona) =>
            persona["IdPersona"] == this.myForm.get("_idPersona").value
        );
        var index = personas.indexOf(persona);
        personas.splice(index, 1);
        respuesta["respuesta"].Acciones = this.renderizarTablaOriginal;
        personas.push(respuesta["respuesta"]);
        this.personas.data = personas;
        this.nuevaPersona = "Nueva Persona";
        this.contacto = "Contacto ";
        this.direccion = "Direccion";
        this.guardar = "Guardar";
        this.botonInsertar = "insertar";
        this.myForm.get("_telefono1").disable();
        this.myForm.get("_telefono2").disable();
        this.myForm.reset();
      } else if (respuesta["codigo"] == "400") {
        openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
      } else if (respuesta["codigo"] == "418") {
        openDialog(respuesta["mensaje"], "advertencia", this.dialog);
      } else if (respuesta["codigo"] == "500") {
        openDialog("Problemas con el servidor", "advertencia", this.dialog);
      }
    }
  }

  cancelar() {
    this.myForm.reset();
    this.myForm.get("_tipoTelefono1").disable();
    this.myForm.get("_tipoTelefono2").disable();
    this.myForm.get("_tipoDocumento").disable();
  }

  ngOnInit() {
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
    if (this.router.url === "/compras-rubros") {
      this.mostrarEnModuloPersona = false;
      this.claseParaModuloPersona = "col-lg-12";
    }
    if (this.renderizarTablaOriginal == "false") {
      this.mostrarTablaPersonasEnVista = false;
    } else {
      this.mostrarTablaPersonasEnVista = true;
    }
    this.myForm.get("_telefono1").disable();
    this.myForm.get("_telefono2").disable();
    this.myForm.get("_numeroDocumento").disable();
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
