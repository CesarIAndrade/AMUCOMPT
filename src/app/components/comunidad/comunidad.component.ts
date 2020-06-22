import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { salir } from '../../../environments/environment';
import { Router } from '@angular/router';

// Components
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';

// Material
import {
  MatDialog,
  MatPaginator,
  MatTableDataSource,
  MatSnackBar,
} from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

@Component({
  selector: "app-comunidad",
  templateUrl: "./comunidad.component.html",
  styleUrls: ["./comunidad.component.css"],
})
export class ComunidadComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _idComunidad: new FormControl(""),
      _comunidad: new FormControl("", [Validators.required]),
      _idParroquia: new FormControl("", [Validators.required]),
      _parroquia: new FormControl(""),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";
  filterComunidad = "";
  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  comunidades = new MatTableDataSource<Element[]>();

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

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase(); 
    this.comunidades.filter = term;
  }

  async consultarComunidades() {
    var respuesta = await this.panelAdministracionService.consultarComunidades();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var comunidades: any = [];
      respuesta["respuesta"].map((comunidad) => {
        comunidades.push({
          IdParroquia: comunidad.Parroquia.IdParroquia,
          Parroquia: comunidad.Parroquia.Descripcion,
          IdComunidad: comunidad.IdComunidad,
          Descripcion: comunidad.Descripcion,
          PermitirEliminacion: comunidad.PermitirEliminacion,
        });
      });
      this.comunidades.data = comunidades;
      this.comunidades.paginator = this.paginator;
    } else if (respuesta["codigo"] == "403") {
      this.openDialog("Sesión Caducada", "advertencia");
      this.router.navigateByUrl(salir())
    }
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == "ingresar") {
        this.crearComunidad();
      } else if (this.botonIngresar == "modificar") {
        this.actualizarComunidad();
      }
    }
  }

  async crearComunidad() {
    var comunidad = await this.panelAdministracionService.crearComunidad(
      this.myForm.get("_idParroquia").value,
      this.myForm.get("_comunidad").value
    );
    if (comunidad["codigo"] == "200") {
      var comunidades: any = this.comunidades.data;
      comunidades.push({
        IdParroquia: comunidad["respuesta"].Parroquia.IdParroquia,
        Parroquia: comunidad["respuesta"].Parroquia.Descripcion,
        IdComunidad: comunidad["respuesta"].IdComunidad,
        Descripcion: comunidad["respuesta"].Descripcion,
        PermitirEliminacion: comunidad["respuesta"].PermitirEliminacion,
      });
      this.comunidades.data = comunidades;
      this.myForm.reset();
      this.panelAdministracionService.refresh$.emit();
      this.openSnackBar("Se ingresó correctamente");
    } else if (comunidad["codigo"] == "400") {
      this.openDialog("Inténtalo de nuevo", "advertencia");
    } else if (comunidad["codigo"] == "418") {
      this.openDialog(comunidad["mensaje"], "advertencia");
    } else if (comunidad["codigo"] == "500") {
      this.openDialog("Problemas con el servidor", "advertencia");
    }
  }

  async actualizarComunidad() {
    var respuesta = await this.panelAdministracionService.actualizarComunidad(
      this.myForm.get("_idParroquia").value,
      this.myForm.get("_idComunidad").value,
      this.myForm.get("_comunidad").value
    );
    if (respuesta["codigo"] == "200") {
      var comunidades: any = this.comunidades.data;
      var comunidad = comunidades.filter(
        (comunidad) =>
          comunidad["IdComunidad"] == this.myForm.get("_idComunidad").value
      );
      var index = comunidades.indexOf(comunidad[0]);
      comunidades.splice(index, 1);
      comunidades.push({
        IdParroquia: respuesta["respuesta"].Parroquia.IdParroquia,
        Parroquia: respuesta["respuesta"].Parroquia.Descripcion,
        IdComunidad: respuesta["respuesta"].IdComunidad,
        Descripcion: respuesta["respuesta"].Descripcion,
        PermitirEliminacion: respuesta["respuesta"].PermitirEliminacion,
      });
      this.comunidades.data = comunidades;
      this.myForm.reset();
      this.botonIngresar = "ingresar";
      this.panelAdministracionService.refresh$.emit();
      this.openSnackBar("Se actualizó correctamente");
    } else if (respuesta["codigo"] == "400") {
      this.openDialog("Inténtalo de nuevo", "advertencia");
    } else if (respuesta["codigo"] == "418") {
      this.openDialog(respuesta["mensaje"], "advertencia");
    } else if (respuesta["codigo"] == "500") {
      this.openDialog("Problemas con el servidor", "advertencia");
    }
  }

  async eliminarComunidad(idComunidad: string) {
    let dialogRef = this.dialog.open(ComfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: ""
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.panelAdministracionService.eliminarComunidad(
          idComunidad
        );
        if (respuesta["codigo"] == "200") {
          var comunidades: any = this.comunidades.data;
          var comunidad = comunidades.filter(
            (comunidad) =>
              comunidad["IdComunidad"] == this.myForm.get("_idComunidad").value
          );
          var index = comunidades.indexOf(comunidad[0]);
          comunidades.splice(index, 1);
          this.comunidades.data = comunidades;
          this.myForm.reset();
          this.panelAdministracionService.refresh$.emit();
          this.openSnackBar("Se eliminó correctamente");
        } else if (respuesta["codigo"] == "400") {
          this.openDialog("Inténtalo de nuevo", "advertencia");
        } else if (respuesta["codigo"] == "418") {
          this.openDialog(respuesta["mensaje"], "advertencia");
        } else if (respuesta["codigo"] == "500") {
          this.openDialog("Problemas con el servidor", "advertencia");
        }
      }
    });
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

  mostrarComunidad(comunidad) {
    this.myForm.get("_idComunidad").setValue(comunidad.IdComunidad);
    this.myForm.get("_comunidad").setValue(comunidad.Descripcion);
    this.myForm.get("_idParroquia").setValue(comunidad.IdParroquia);
    this.myForm.get("_parroquia").setValue(comunidad.Parroquia);
    this.botonIngresar = "modificar";
  }

  ngOnInit() {
    this.consultarComunidades();
    this.panelAdministracionService.refresh$.subscribe(() => {
      this.consultarComunidades();
    });
  }

  tablaComunidades = ["comunidad", "parroquia", "acciones"];
}
