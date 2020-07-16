import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { salir, openDialog, openSnackBar } from "../../functions/global";
import { Router } from "@angular/router";

// Components
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

// Material
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatSnackBar,
} from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

@Component({
  selector: "app-provincia",
  templateUrl: "./provincia.component.html",
  styleUrls: ["./provincia.component.css"],
})
export class ProvinciaComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idProvincia: new FormControl(""),
      _provincia: new FormControl("", [Validators.required]),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";
  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  provincias = new MatTableDataSource<Element[]>();

  async consultarProvincias() {
    var provincias = await this.panelAdministracionService.consultarProvincias();
    console.log(provincias);
    if (provincias["codigo"] == "200") {
      this.loading = false;
      this.provincias.data = provincias["respuesta"];
      this.provincias.paginator = this.paginator;
    } else if (provincias["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir())
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

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.provincias.filter = term;
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
      openSnackBar("Se ingresó correctamente", this.snackBar);
    } else if (provincia["codigo"] == "400") {
      openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
    } else if (provincia["codigo"] == "418") {
      openDialog(provincia["mensaje"], "advertencia", this.dialog);
    } else if (provincia["codigo"] == "500") {
      openDialog("Problemas con el servidor", "advertencia", this.dialog);
    }
  }

  async actualizarProvincia() {
    var respuesta = await this.panelAdministracionService.actualizarProvincia(
      this.myForm.get("_idProvincia").value,
      this.myForm.get("_provincia").value
    );
    if (respuesta["codigo"] == "200") {
      var provincias: any = this.provincias.data;
      provincias = provincias.filter(
        (provincia) =>
          provincia["IdProvincia"] ===! this.myForm.get("_idProvincia").value
      );
      provincias.push({
        IdProvincia: respuesta["respuesta"].IdProvincia,
        Descripcion: respuesta["respuesta"].Descripcion,
        PermitirEliminacion: respuesta["respuesta"].PermitirEliminacion,
      });
      this.provincias.data = provincias;
      this.myForm.reset();
      this.botonIngresar = "ingresar";
      openSnackBar("Se actualizó correctamente", this.snackBar);
    } else if (respuesta["codigo"] == "400") {
      openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
    } else if (respuesta["codigo"] == "418") {
      openDialog(respuesta["mensaje"], "advertencia", this.dialog);
    } else if (respuesta["codigo"] == "500") {
      openDialog("Problemas con el servidor", "advertencia", this.dialog);
    }
  }

  eliminarProvincia(idProvincia) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.panelAdministracionService.eliminarProvincia(
          idProvincia
        );
        if (respuesta["codigo"] == "200") {
          var provincias = this.provincias.data;
          provincias = provincias.filter(
            (provincia) => provincia["IdProvincia"] ===! idProvincia
          );
          this.provincias.data = provincias;
          openSnackBar("Se eliminó correctamente", this.snackBar);
        } else if (respuesta["codigo"] == "400") {
          openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "418") {
          openDialog(respuesta["mensaje"], "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "500") {
          openDialog("Problemas con el servidor", "advertencia", this.dialog);
        }
      }
    });
  }

  mostrarProvincia(provincia) {
    console.log(provincia);

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
