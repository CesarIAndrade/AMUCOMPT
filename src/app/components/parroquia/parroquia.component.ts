import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog, MatPaginator, MatTableDataSource, MatSnackBar } from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

// Components
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

@Component({
  selector: "app-parroquia",
  templateUrl: "./parroquia.component.html",
  styleUrls: ["./parroquia.component.css"],
})
export class ParroquiaComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private modalLocalidadSuperior: MatDialog,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
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
  filterParroquia = "";

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  parroquias = new MatTableDataSource<Element[]>();

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

  consultarParroquias() {
    this.panelAdministracionService
      .consultarParroquias()
      .then((ok) => {
        this.parroquias.data = [];
        this.parroquias.data = ok["respuesta"];
        this.parroquias.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
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
    console.log(parroquia);
  }

  async actualizarParroquia() {
    var parroquia = await this.panelAdministracionService.actualizarParroquia(
      this.myForm.get("_idCanton").value,
      this.myForm.get("_idParroquia").value,
      this.myForm.get("_parroquia").value
    );
    console.log(parroquia);
  }

  async eliminarParroquia(idParroquia: string) {
    var respuesta = await this.panelAdministracionService.eliminarParroquia(
      idParroquia
    );
    console.log(respuesta);
  }

  abrirModal() {
    let dialogRef = this.modalLocalidadSuperior.open(
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
    this.myForm.get("_idCanton").setValue(parroquia.Canton.IdCanton);
    this.myForm.get("_canton").setValue(parroquia.Canton.Descripcion);
    this.botonIngresar = "modificar";
  }

  ngOnInit() {
    this.consultarParroquias();
  }

  tablaParroquias = ["parroquia", "canton", "acciones"];
}
