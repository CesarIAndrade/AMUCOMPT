import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { salir } from '../../../environments/environment';

// Components
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";
import { ComfirmDialogComponent } from "../comfirm-dialog/comfirm-dialog.component";

// Material
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSnackBar,
} from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { Router } from '@angular/router';

@Component({
  selector: "app-canton",
  templateUrl: "./canton.component.html",
  styleUrls: ["./canton.component.css"],
})
export class CantonComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private modalLocalidadSuperior: MatDialog,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _idCanton: new FormControl(""),
      _canton: new FormControl("", [Validators.required]),
      _idProvincia: new FormControl("", [Validators.required]),
      _provincia: new FormControl(""),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";
  filterCanton = "";
  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  cantones = new MatTableDataSource<Element[]>();

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
    this.cantones.filter = term;
  }

  async consultarCantones() {
    var respuesta = await this.panelAdministracionService.consultarCantones();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var cantones: any = [];
      respuesta["respuesta"].map((canton) => {
        cantones.push({
          IdProvincia: canton.Provincia.IdProvincia,
          Provincia: canton.Provincia.Descripcion,
          IdCanton: canton.IdCanton,
          Descripcion: canton.Descripcion,
          PermitirEliminacion: canton.PermitirEliminacion,
        });
      });
      this.cantones.data = cantones;
      this.cantones.paginator = this.paginator;
    } else if (respuesta["codigo"] == "403") {
      this.openDialog("Sesión Caducada", "advertencia");
      this.router.navigateByUrl(salir())
    }
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == "ingresar") {
        this.crearCanton();
      } else if (this.botonIngresar == "modificar") {
        this.actualizarCanton();
      }
    }
  }

  async crearCanton() {
    var canton = await this.panelAdministracionService.crearCanton(
      this.myForm.get("_idProvincia").value,
      this.myForm.get("_canton").value
    );
    if (canton["codigo"] == "200") {
      var cantones: any = this.cantones.data;
      cantones.push({
        IdProvincia: canton["respuesta"].Provincia.IdProvincia,
        Provincia: canton["respuesta"].Provincia.Descripcion,
        IdCanton: canton["respuesta"].IdCanton,
        Descripcion: canton["respuesta"].Descripcion,
        PermitirEliminacion: canton["respuesta"].PermitirEliminacion,
      });
      this.cantones.data = cantones;
      this.myForm.reset();
      this.panelAdministracionService.refresh$.emit();
      this.openSnackBar("Se ingresó correctamente");
    } else if (canton["codigo"] == "400") {
      this.openDialog("Inténtalo de nuevo", "advertencia");
    } else if (canton["codigo"] == "418") {
      this.openDialog(canton["mensaje"], "advertencia");
    } else if (canton["codigo"] == "500") {
      this.openDialog("Problemas con el servidor", "advertencia");
    }
  }

  async actualizarCanton() {
    var respuesta = await this.panelAdministracionService.actualizarCanton(
      this.myForm.get("_idProvincia").value,
      this.myForm.get("_idCanton").value,
      this.myForm.get("_canton").value
    );
    if (respuesta["codigo"] == "200") {
      var cantones: any = this.cantones.data;
      var canton = cantones.filter(
        (canton) => canton["IdCanton"] == this.myForm.get("_idCanton").value
      );
      var index = cantones.indexOf(canton[0]);
      cantones.splice(index, 1);
      cantones.push({
        IdProvincia: respuesta["respuesta"].Provincia.IdProvincia,
        Provincia: respuesta["respuesta"].Provincia.Descripcion,
        IdCanton: respuesta["respuesta"].IdCanton,
        Descripcion: respuesta["respuesta"].Descripcion,
        PermitirEliminacion: respuesta["respuesta"].PermitirEliminacion,
      });
      this.cantones.data = cantones;
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

  async eliminarCanton(idCanton) {
    let dialogRef = this.dialog.open(ComfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.panelAdministracionService.eliminarCanton(
          idCanton
        );
        if (respuesta["codigo"] == "200") {
          var cantones = this.cantones.data;
          var canton = cantones.filter(
            (canton) => canton["IdCanton"] == idCanton
          );
          var index = cantones.indexOf(canton[0]);
          cantones.splice(index, 1);
          this.cantones.data = cantones;
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
    let dialogRef = this.modalLocalidadSuperior.open(
      ModalLocalidadSuperiorComponent,
      {
        width: "400px",
        height: "auto",
        data: {
          ruta: "cantones",
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_idProvincia").setValue(result.idLocalidad);
        this.myForm.get("_provincia").setValue(result.descripcion);
      }
    });
  }

  mostrarCanton(canton) {
    this.myForm.get("_idCanton").setValue(canton.IdCanton);
    this.myForm.get("_canton").setValue(canton.Descripcion);
    this.myForm.get("_idProvincia").setValue(canton.IdProvincia);
    this.myForm.get("_provincia").setValue(canton.Provincia);
    this.botonIngresar = "modificar";
  }

  ngOnInit() {
    this.consultarCantones();
    this.panelAdministracionService.refresh$.subscribe(() => {
      this.consultarCantones();
    });
  }

  tablaCantones = ["canton", "provincia", "acciones"];
}
