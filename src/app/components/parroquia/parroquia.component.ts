import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { salir } from '../../../environments/environment';
import { Router } from '@angular/router';

// Components
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';

// Material
import { MatDialog, MatPaginator, MatTableDataSource, MatSnackBar } from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

@Component({
  selector: "app-parroquia",
  templateUrl: "./parroquia.component.html",
  styleUrls: ["./parroquia.component.css"],
})
export class ParroquiaComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _idParroquia: new FormControl(""),
      _parroquia: new FormControl("", [Validators.required]),
      _idCanton: new FormControl("", [Validators.required]),
      _canton: new FormControl(""),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";
  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  parroquias = new MatTableDataSource<Element[]>();

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
    this.parroquias.filter = term;
  }

  async consultarParroquias() {
    var respuesta = await this.panelAdministracionService.consultarParroquias();
    if(respuesta["codigo"] == "200") {
      this.loading = false;
      var parroquias: any = [];
      respuesta["respuesta"].map((parroquia) => {
        parroquias.push({
          IdCanton: parroquia.Canton.IdCanton,
          Canton: parroquia.Canton.Descripcion,
          IdParroquia: parroquia.IdParroquia,
          Descripcion: parroquia.Descripcion,
          PermitirEliminacion: parroquia.PermitirEliminacion
        })
      })
      this.parroquias.data = parroquias;
      this.parroquias.paginator = this.paginator;
    } else if (respuesta["codigo"] == "403") {
      this.openDialog("Sesión Caducada", "advertencia");
      this.router.navigateByUrl(salir())
    }
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == "ingresar") {
        this.crearParroquia();
      } else if (this.botonIngresar == "modificar") {
        this.actualizarParroquia();
      }
    }
  }

  async crearParroquia() {
    var parroquia = await this.panelAdministracionService.crearParroquia(
      this.myForm.get("_idCanton").value,
      this.myForm.get("_parroquia").value
    );
    if (parroquia["codigo"] == "200") {
      var parroquias: any = this.parroquias.data;
      parroquias.push({
        IdCanton: parroquia["respuesta"].Canton.IdCanton,
        Canton: parroquia["respuesta"].Canton.Descripcion,
        IdParroquia: parroquia["respuesta"].IdParroquia,
        Descripcion: parroquia["respuesta"].Descripcion,
        PermitirEliminacion: parroquia["respuesta"].PermitirEliminacion
      });
      this.parroquias.data = parroquias;
      this.myForm.reset();
      this.panelAdministracionService.refresh$.emit();
      this.openSnackBar("Se ingresó correctamente");
    } else if (parroquia["codigo"] == "400") {
      this.openDialog("Inténtalo de nuevo", "advertencia");
    } else if (parroquia["codigo"] == "418") {
      this.openDialog(parroquia["mensaje"], "advertencia");
    } else if (parroquia["codigo"] == "500") {
      this.openDialog("Problemas con el servidor", "advertencia");
    }
  }

  async actualizarParroquia() {
    var respuesta = await this.panelAdministracionService.actualizarParroquia(
      this.myForm.get("_idCanton").value,
      this.myForm.get("_idParroquia").value,
      this.myForm.get("_parroquia").value
    );
    if (respuesta["codigo"] == "200") {
      var parroquias: any = this.parroquias.data;
      var parroquia = parroquias.filter(
        (parroquia) => parroquia["IdParroquia"] == this.myForm.get("_idParroquia").value
      );
      var index = parroquias.indexOf(parroquia[0]);
      parroquias.splice(index, 1);
      parroquias.push({
        IdCanton: respuesta["respuesta"].Canton.IdCanton,
        Canton: respuesta["respuesta"].Canton.Descripcion,
        IdParroquia: respuesta["respuesta"].IdParroquia,
        Descripcion: respuesta["respuesta"].Descripcion,
        PermitirEliminacion: respuesta["respuesta"].PermitirEliminacion
      });
      this.parroquias.data = parroquias;
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

  async eliminarParroquia(idParroquia: string) {
    let dialogRef = this.dialog.open(ComfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: ""
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.panelAdministracionService.eliminarParroquia(
          idParroquia
        );
        if (respuesta["codigo"] == "200") {
          var parroquias: any = this.parroquias.data;
          var parroquia = parroquias.filter(
            (parroquia) => parroquia["IdParroquia"] == idParroquia
          );
          var index = parroquias.indexOf(parroquia[0]);
          parroquias.splice(index, 1);
          this.parroquias.data = parroquias;
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
          ruta: "parroquias",
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_idCanton").setValue(result.idLocalidad);
        this.myForm.get("_canton").setValue(result.descripcion);
      }
    });
  }

  limpiarCampos() {
    this.myForm.reset();
    this.myForm.get("_canton").setValue("Cantón");
  }

  mostrarParroquia(parroquia) {
    this.myForm.get("_idParroquia").setValue(parroquia.IdParroquia);
    this.myForm.get("_parroquia").setValue(parroquia.Descripcion);
    this.myForm.get("_idCanton").setValue(parroquia.IdCanton);
    this.myForm.get("_canton").setValue(parroquia.Canton);
    this.botonIngresar = "modificar";
  }
 
  ngOnInit() {
    this.consultarParroquias();
    this.panelAdministracionService.refresh$.subscribe(() => {
      this.consultarParroquias();
    });
  }

  tablaParroquias = ["parroquia", "canton", "acciones"];
}
