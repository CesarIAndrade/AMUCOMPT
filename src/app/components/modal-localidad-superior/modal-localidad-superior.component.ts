import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

// Components
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

// Material
import {
  MAT_DIALOG_DATA,
  MatPaginator,
  MatTableDataSource,
  MatDialog,
  MatSnackBar,
} from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

@Component({
  selector: "app-modal-localidad-superior",
  templateUrl: "./modal-localidad-superior.component.html",
  styleUrls: ["./modal-localidad-superior.component.css"],
})
export class ModalLocalidadSuperiorComponent implements OnInit {
  myForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private panelAdministracionService: PanelAdministracionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idComunidad: new FormControl(""),
      _comunidad: new FormControl("", [Validators.required]),
      _idParroquia: new FormControl("", [Validators.required]),
      _parroquia: new FormControl(""),
    });
  }

  nombre_tabla = "";
  filter_tabla = "";
  loading = true;
  datosLocalidad = {
    idLocalidad: "",
    descripcion: "",
  };

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  lista_tabla = new MatTableDataSource<Element[]>();

  async consultarProvincias() {
    this.loading = true;
    var respuesta = await this.panelAdministracionService.consultarProvincias();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      this.lista_tabla.data = [];
      this.lista_tabla.data = respuesta["respuesta"];
      this.lista_tabla.paginator = this.paginator;
    }
  }

  async consultarCantones() {
    this.loading = true;
    var respuesta = await this.panelAdministracionService.consultarCantones();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      this.lista_tabla.data = [];
      this.lista_tabla.data = respuesta["respuesta"];
      this.lista_tabla.paginator = this.paginator;
    }
  }

  async consultarParroquias() {
    this.loading = true;
    var respuesta = await this.panelAdministracionService.consultarParroquias();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      this.lista_tabla.data = [];
      this.lista_tabla.data = respuesta["respuesta"];
      this.lista_tabla.paginator = this.paginator;
    }
  }

  async consultarComunidades() {
    this.loading = true;
    var respuesta = await this.panelAdministracionService.consultarComunidades();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      this.lista_tabla.data = [];
      this.lista_tabla.data = respuesta["respuesta"];
      this.lista_tabla.paginator = this.paginator;
    }
  }

  setLocalidad(localidad) {
    if (this.nombre_tabla == "Provincias") {
      this.datosLocalidad.idLocalidad = localidad.IdProvincia;
    } else if (this.nombre_tabla == "Cantones") {
      this.datosLocalidad.idLocalidad = localidad.IdCanton;
    } else if (this.nombre_tabla == "Parroquias") {
      this.datosLocalidad.idLocalidad = localidad.IdParroquia;
    } else if (this.nombre_tabla == "Comunidades") {
      this.datosLocalidad.idLocalidad = localidad.IdComunidad;
    }
    this.datosLocalidad.descripcion = localidad.Descripcion;
  }

  abrirModal() {
    let dialogRef = this.dialog.open(
      ModalLocalidadSuperiorComponent,
      {
        width: "400px",
        height: "auto",
        data: {
          ruta: "comunidades",
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_idParroquia").setValue(result.idLocalidad);
        this.myForm.get("_parroquia").setValue(result.descripcion);
      }
    });
  }

  async crearComunidad() {
    var comunidad = await this.panelAdministracionService.crearComunidad(
      this.myForm.get("_idParroquia").value,
      this.myForm.get("_comunidad").value
    );
    if (comunidad["codigo"] == "200") {
      var comunidades: any = this.lista_tabla.data;
      comunidades.push({
        IdParroquia: comunidad["respuesta"].Parroquia.IdParroquia,
        Parroquia: comunidad["respuesta"].Parroquia.Descripcion,
        IdComunidad: comunidad["respuesta"].IdComunidad,
        Descripcion: comunidad["respuesta"].Descripcion,
        PermitirEliminacion: comunidad["respuesta"].PermitirEliminacion,
      });
      this.lista_tabla.data = comunidades;
      this.myForm.reset();
      this.panelAdministracionService.refresh$.emit();
    } else if (comunidad["codigo"] == "400") {
      this.openDialog("Inténtalo de nuevo", "advertencia");
    } else if (comunidad["codigo"] == "418") {
      this.openDialog(comunidad["mensaje"], "advertencia");
    } else if (comunidad["codigo"] == "500") {
      this.openDialog("Problemas con el servidor", "advertencia");
    }
  }

  openDialog(mensaje, icono): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: { mensaje: mensaje, icono: icono },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 2000,
      horizontalPosition: "right",
    });
  }

  siSonComunidades = "col-12";
  ngOnInit() {
    if (this.data.ruta == "cantones") {
      this.nombre_tabla = "Provincias";
      this.consultarProvincias();
    } else if (this.data.ruta == "parroquias") {
      this.nombre_tabla = "Cantones";
      this.consultarCantones();
    } else if (this.data.ruta == "comunidades") {
      this.nombre_tabla = "Parroquias";
      this.consultarParroquias();
    } else if (this.data.ruta == "ventas") {
      this.nombre_tabla = "Comunidades";
      this.consultarComunidades();
      this.siSonComunidades = "col-lg-7 col-md-7";
    }
  }

  tabla = ["localidad", "acciones"];
}
