import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog, MatPaginator, MatTableDataSource, MatSnackBar } from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

// Components
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

@Component({
  selector: "app-comunidad",
  templateUrl: "./comunidad.component.html",
  styleUrls: ["./comunidad.component.css"],
})
export class ComunidadComponent implements OnInit {
  constructor(
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

  myForm: FormGroup;
  botonIngresar = "ingresar";
  filterComunidad = "";

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  comunidades = new MatTableDataSource<Element[]>();

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

  async consultarComunidades() {
    var comunidades = await this.panelAdministracionService.consultarComunidades();
    if (comunidades["codigo"] == "200") {
      this.comunidades.data = comunidades["respuesta"];
      this.comunidades.paginator = this.paginator;
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
    console.log(comunidad);
  }

  async actualizarComunidad() {
    var comunidad = await this.panelAdministracionService.actualizarComunidad(
      this.myForm.get("_idParroquia").value,
      this.myForm.get("_idComunidad").value,
      this.myForm.get("_comunidad").value
    );
    console.log(comunidad);
  }

  async eliminarComunidad(idComunidad: string) {
    var respuesta = await this.panelAdministracionService.eliminarComunidad(
      idComunidad
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
    this.myForm.get("_idParroquia").setValue(comunidad.Parroquia.IdParroquia);
    this.myForm.get("_parroquia").setValue(comunidad.Parroquia.Descripcion);
    this.botonIngresar = "modificar";
  }

  ngOnInit() {
    this.consultarComunidades();
  }

  tablaComunidades = ["comunidad", "parroquia", "acciones"];
}
