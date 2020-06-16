import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatSnackBar,
} from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

@Component({
  selector: "app-provincia",
  templateUrl: "./provincia.component.html",
  styleUrls: ["./provincia.component.css"],
})
export class ProvinciaComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idProvincia: new FormControl(""),
      _provincia: new FormControl("", [Validators.required]),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";
  filterProvincia = "";
  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  provincias = new MatTableDataSource<Element[]>();

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
      this.loading = false;
      this.provincias.data = provincias["respuesta"];
      this.provincias.paginator = this.paginator;
    }
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == "ingresar") {
        this.crearProvincia();
      } else if (this.botonIngresar == "modificar") {
        this.actualizarProvincia();
      }
    }
  }

  async crearProvincia() {
    var provincia = await this.panelAdministracionService.crearProvincia(
      this.myForm.get("_provincia").value
    );
    if (provincia["codigo"] == "200") {
      var provincias: any = this.provincias.data;
      provincias.push({
        IdProvincia: provincia["respuesta"].IdProvincia,
        Descripcion: provincia["respuesta"].Descripcion,
        PermitirEliminacion: provincia["respuesta"].PermitirEliminacion,
      });
      this.provincias.data = provincias;
      this.myForm.reset();
      this.myForm.setErrors({ invalid: true });
      this.openSnackBar("Se ingresó correctamente");
    } else if (provincia["codigo"] == "400") {
      this.openDialog("Inténtalo de nuevo");
    } else if (provincia["codigo"] == "418") {
      this.openDialog(provincia["mensaje"]);
    } else if (provincia["codigo"] == "500") {
      this.openDialog("Problemas con el servidor");
    }
  }

  async actualizarProvincia() {
    var respuesta = await this.panelAdministracionService.actualizarProvincia(
      this.myForm.get("_idProvincia").value,
      this.myForm.get("_provincia").value
    );
    if (respuesta["codigo"] == "200") {
      var provincias: any = this.provincias.data;
      var provincia = provincias.filter(
        (provincia) =>
          provincia["IdProvincia"] == this.myForm.get("_idProvincia").value
      );
      var index = provincias.indexOf(provincia[0]);
      provincias.splice(index, 1);
      provincias.push({
        IdProvincia: respuesta["respuesta"].IdProvincia,
        Descripcion: respuesta["respuesta"].Descripcion,
        PermitirEliminacion: respuesta["respuesta"].PermitirEliminacion,
      });
      this.provincias.data = provincias;
      this.myForm.reset();
      this.botonIngresar = "ingresar";
      this.openSnackBar("Se actualizó correctamente");
    } else if (respuesta["codigo"] == "400") {
      this.openDialog("Inténtalo de nuevo");
    } else if (respuesta["codigo"] == "418") {
      this.openDialog(respuesta["mensaje"]);
    } else if (respuesta["codigo"] == "500") {
      this.openDialog("Problemas con el servidor");
    }
  }

  async eliminarProvincia(idProvincia) {
    var respuesta = await this.panelAdministracionService.eliminarProvincia(
      idProvincia
    );
    if (respuesta["codigo"] == "200") {
      var provincias = this.provincias.data;
      var provincia = provincias.filter(
        (provincia) => provincia["IdProvincia"] == idProvincia
      );
      var index = provincias.indexOf(provincia[0]);
      provincias.splice(index, 1);
      this.provincias.data = provincias;
      this.openSnackBar("Se eliminó correctamente");
    } else if (respuesta["codigo"] == "400") {
      this.openDialog("Inténtalo de nuevo");
    } else if (respuesta["codigo"] == "418") {
      this.openDialog(provincia["mensaje"]);
    } else if (respuesta["codigo"] == "500") {
      this.openDialog("Problemas con el servidor");
    }
  }

  mostrarProvincia(provincia) {
    this.myForm.get("_idProvincia").setValue(provincia.IdProvincia);
    this.myForm.get("_provincia").setValue(provincia.Descripcion);
    this.botonIngresar = "modificar";
  }

  ngOnInit() {
    this.consultarProvincias();
    this.panelAdministracionService.refresh$.subscribe(() => {
      this.consultarProvincias();
    });
  }

  tablaProvincias = ["provincia", "acciones"];
}
