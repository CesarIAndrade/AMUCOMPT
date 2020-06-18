import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatPaginator,
  MatTableDataSource,
  MatDialog,
  MatSnackBar,
} from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

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
    private modalLocalidadSuperior: MatDialog,
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

  datosLocalidad = {
    idLocalidad: "",
    descripcion: "",
  };

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  lista_tabla = new MatTableDataSource<Element[]>();

  consultarProvincias() {
    this.panelAdministracionService
      .consultarProvincias()
      .then((ok) => {
        this.lista_tabla.data = [];
        this.lista_tabla.data = ok["respuesta"];
        this.lista_tabla.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  consultarCantones() {
    this.panelAdministracionService
      .consultarCantones()
      .then((ok) => {
        this.lista_tabla.data = [];
        this.lista_tabla.data = ok["respuesta"];
        this.lista_tabla.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  consultarParroquias() {
    this.panelAdministracionService
      .consultarParroquias()
      .then((ok) => {
        this.lista_tabla.data = [];
        this.lista_tabla.data = ok["respuesta"];
        this.lista_tabla.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  consultarComunidades() {
    this.panelAdministracionService
      .consultarComunidades()
      .then((ok) => {
        this.lista_tabla.data = [];
        this.lista_tabla.data = ok["respuesta"];
        this.lista_tabla.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
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
    let dialogRef = this.modalLocalidadSuperior.open(
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
    console.log(comunidad);
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
      this.openDialog("Inténtalo de nuevo");
    } else if (comunidad["codigo"] == "418") {
      this.openDialog(comunidad["mensaje"]);
    } else if (comunidad["codigo"] == "500") {
      this.openDialog("Problemas con el servidor");
    }
  }

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
